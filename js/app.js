import api from './api.js';
import MovieItem from './components/MovieItem.js';
import Detail from './components/Detail.js';
import util from './utils/util.js';

const PAGE_SIZE = 10;

const form = document.querySelector('.search-form');
const input = form.querySelector('.search-input');

const moviesContainer = document.querySelector('.movies-grid');
const loader = document.querySelector('.loader');
const noResults = document.querySelector('.no-results');

const detail = document.querySelector('.detail');
const detailModal = new Detail(detail);

const debouncedScrollListener = util.debounce(scrollListener, 100);

/**
 * Object to keep track of the page count, results, query and if the
 * page request finished or its waiting.
 */
const searchData = {
    query: '',
    nextPage: 1,
    total: 0,
    fetching: false
}

/**
 * Listener to start searching the movie results.
 */
form.addEventListener('submit', function (event) {
    const query = input.value;

    searchData.query = query;
    searchData.nextPage = 1;
    searchData.total = 0;

    event.preventDefault();

    if (query !== '') {
        moviesContainer.textContent = '';
        noResults.textContent = '';
        searchMovies(query);
    }
});

/**
 * listener that opens the detail view based 
 * on the clicked movie Id by event delegation.
 */
moviesContainer.addEventListener('click', function (event) {
    const target = event.target;
    const movieId = target.dataset.id;

    if (movieId) {
        detailModal.open();
        api.getMovieInfo(movieId)
            .then(function (data) {
                console.log('[Detail] MovieInfo data arrived. updating the detail view.');
                detailModal.setData(data);
            })
            .catch(function () {
                console.log('[Detail] MovieInfo data failed. updating the detail view with an error message.');
                detailModal.setErrorData();
            });
    }
});

/**
 * Scroll Listener to search the next movies page when the user
 * is arriving to the bottom of the scroll.
 */
function scrollListener() {
    const d = document.documentElement;
    const offset = d.scrollTop + window.innerHeight;
    const height = d.offsetHeight;

    if (offset >= height - 100 && !searchData.fetching && searchData.hasNext) {
        searchMovies(searchData.query, searchData.nextPage);
    }
}

/**
 * Method to add the debounced scroll listener to the window.
 */
function addScrollListener() {
    console.log('[Scroll Pagination] adding scroll listener');
    window.addEventListener('scroll', debouncedScrollListener);
}

/**
 * Method to remove the debounced scroll listener to the window.
 */
function removeScrollListener() {
    console.log('[Scroll Pagination] removing scroll listener');
    window.removeEventListener('scroll', debouncedScrollListener);
}

/**
 * Method to request the movies with some basic error handling.
 * @param {String} query Query string to search
 * @param {Number} page Page number to request
 */
function searchMovies(query, page = 1) {
    searchData.fetching = true;
    showLoader();

    api.gethMovies(query, page)
        .then(function ({ Search: results = [], totalResults = 0, Response: response = 'False' }) {
            if (response === 'True') {
                console.log(`[Search] Results page ${page} ready to be painted.`);
                hideError();
                displayMovies(results);

                searchData.totalResults = totalResults;
                searchData.hasNext = (page - 1) * PAGE_SIZE + results.length < totalResults;

                if (page === 1 && searchData.hasNext) {
                    addScrollListener();
                }

                if (searchData.hasNext) {
                    searchData.nextPage += 1;
                } else {
                    removeScrollListener();
                }
            } else {
                showError();
                removeScrollListener();
            }
        })
        .catch(function () {
            if (searchData.nextPage === 1) {
                console.log('[Search] Page 1 failed. Show error message and try again.');
                showNetworkError();
            } else {
                console.log(`[Search] Page ${searchData.nextPage} failed. Requesting it again.`);
            }
        })
        .finally(function () {
            hideLoader();
            searchData.fetching = false;
        });
}

/**
 * Method to pain a movies list in the moviesContainer
 * @param {Array} movies movies array to be added to the movies result container.
 */
function displayMovies(movies) {
    movies.forEach(function (movie) {
        const item = new MovieItem(movie);
        const htmlElement = item.getElement();

        moviesContainer.appendChild(htmlElement);
    });
}

function showError() {
    noResults.textContent = `Your search - ${searchData.query} - did not match any movie.`;
    noResults.classList.remove('hidden');
}

function showNetworkError() {
    noResults.textContent = `There was an error requesting the movies. Try again.`;
    noResults.classList.remove('hidden');
}

function hideError() {
    noResults.textContent = '';
    noResults.classList.add('hidden');
}

function showLoader() {
    loader.classList.remove('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}