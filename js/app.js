import api from './api.js';
import MovieItem from './components/MovieItem.js';
import Detail from './components/Detail.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const moviesContainer = document.querySelector('.movies-grid');
const loader = document.querySelector('.loader');
const noResults = document.querySelector('.no-results');
const detail = document.querySelector('.detail');
const detailModal = new Detail(detail);

const searchData = {
    query: '',
    page: 1,
    total: 0,
    fetching: false
}

form.addEventListener('submit', (event) => {
    const query = input.value;

    searchData.query = query;
    searchData.page = 1;
    searchData.total = 0;

    event.preventDefault();

    if (query !== '') {
        moviesContainer.innerHTML = '';
        loader.style.display = 'block';

        searchMovies(query);
    }
});

moviesContainer.addEventListener('click', (event) => {
    const target = event.target;
    const movieId = target.dataset.id;

    if (movieId) {
        detailModal.open();
        api.getMovieInfo(movieId)
            .then((data) => {
                detailModal.setData(data.Title, data.Plot);
                console.log(data);
            })
            .catch(function () {
                detailModal.setErrorData();
            });
    }
});


function scrollListener(event) {
    const d = document.documentElement;
    const offset = d.scrollTop + window.innerHeight;
    const height = d.offsetHeight;

    if (offset >= height - 100 && !searchData.fetching) {
        searchData.page += 1;
        searchMovies(searchData.query, searchData.page);
    }
}

function searchMovies(query, page = 1) {
    searchData.fetching = true;
    api.gethMovies(query, page)
        .then(({ Search: results = [], totalResults = 0 }) => {
            loader.style.display = 'none';

            if (results.length) {
                hideError();
                displayMovies(results);

                if (totalResults > 10 && page === 1) {
                    window.addEventListener('scroll', scrollListener);
                }
            } else {
                showError();
                window.removeEventListener('scroll', scrollListener);
            }
            searchData.fetching = false;
        });
}

function displayMovies(movies) {
    movies.forEach(({ imdbID: id, Poster: image, Title: title }) => {
        const item = new MovieItem(id, image, title);

        moviesContainer.appendChild(item.getElement());
    });
}

function showError() {
    noResults.innerHTML = `Your search - ${searchData.query} - did not match any movie.`;
    noResults.style.display = 'block';
}

function hideError() {
    noResults.style.display = 'none';
    noResults.innerHTML = '';
}