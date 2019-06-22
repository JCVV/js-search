import api from './api.js';
import MovieItem from './components/MovieItem.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const moviesContainer = document.querySelector('.movies-grid');
const loader = document.querySelector('.loader');

const searchResults = {
    query: '',
    page: 0,
    total: 0
}

form.addEventListener('submit', (event) => {
    const query = input.value;

    event.preventDefault();
    loader.style.display = 'block';
    searchMovies(query);
});

moviesContainer.addEventListener('click', (event) => {
    const target = event.target;
    const movieId = target.dataset.id;

    api.getMovieInfo(movieId)
        .then((data) => {
            console.log(data);
        });
});

function searchMovies(query, page = 1) {
    api.gethMovies(query, page)
        .then((movies) => {
            moviesContainer.innerHTML = '';
            displayMovies(movies.Search);
        });
}

function displayMovies(movies) {
    loader.style.display = 'none';
    movies.forEach(({ imdbID: id, Poster: image, Title: title }) => {
        const item = new MovieItem(id, image, title);

        moviesContainer.appendChild(item.render());
    });
}

//TODO: REMOVE THIS;

searchMovies('x-men');