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

const searchData = {
    query: '',
    nextPage: 1,
    total: 0,
    fetching: false
}

form.addEventListener('submit', function (event) {
    const query = input.value;

    searchData.query = query;
    searchData.nextPage = 1;
    searchData.total = 0;

    event.preventDefault();

    if (query !== '') {
        moviesContainer.textContent = '';
        searchMovies(query);
    }
});

moviesContainer.addEventListener('click', function (event) {
    const target = event.target;
    const movieId = target.dataset.id;

    if (movieId) {
        detailModal.open();
        api.getMovieInfo(movieId)
            .then(function (data) {
                detailModal.setData(data);
            })
            .catch(function () {
                detailModal.setErrorData();
            });
    }
});


function scrollListener() {
    const d = document.documentElement;
    const offset = d.scrollTop + window.innerHeight;
    const height = d.offsetHeight;

    if (offset >= height - 100 && !searchData.fetching && searchData.hasNext) {
        searchMovies(searchData.query, searchData.nextPage);
    }
}

function addScrollListener() {
    console.log('adding scroll listener');
    window.addEventListener('scroll', debouncedScrollListener);
}

function removeScrollListener() {
    console.log('removing scroll listener');
    window.removeEventListener('scroll', debouncedScrollListener);
}

function searchMovies(query, page = 1) {
    searchData.fetching = true;
    showLoader();
    api.gethMovies(query, page)
        .then(function ({ Search: results = [], totalResults = 0, Response: response = 'False' }) {

            if (response === 'True') {
                console.log('Response = true');
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
                console.log('REMOVING scroll listenerrrrr');
                window.removeEventListener('scroll', debouncedScrollListener);
            }
        })
        .catch(function () {
            hideLoader();

            if (searchData.nextPage === 1) {
                console.log('Page 1 failed. Show error message and try again.');
                showNetworkError();
            } else {
                console.log(`Page ${searchData.nextPage} failed. Requesting it again.`);
            }
        })
        .finally(function () {
            hideLoader();
            searchData.fetching = false;
        });
}

function displayMovies(movies) {
    movies.forEach(function (movie) {
        const item = new MovieItem(movie);

        moviesContainer.appendChild(item.getElement());
    });
}

function showError() {
    noResults.textContent = `Your search - ${searchData.query} - did not match any movie.`;
    noResults.style.display = 'block';
}

function showNetworkError() {
    noResults.textContent = `There was an error requesting the movies. Try again.`;
    noResults.style.display = 'block';
}

function hideError() {
    noResults.style.display = 'none';
    noResults.textContent = '';
}

function showLoader() {
    loader.style.display = 'block';
}

function hideLoader() {
    loader.style.display = 'none';
}