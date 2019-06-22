import api from './api.js';
import MovieItem from './components/MovieItem.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const moviesContainer = document.querySelector('.movies');

form.addEventListener('submit', (event) => {
    const query = input.value;

    event.preventDefault();

    api.gethMovies(query)
        .then((movies) => {
            moviesContainer.innerHTML = '';
            displayMovies(movies.Search);
        });
});

moviesContainer.addEventListener('click', (event) => {
    const target = event.target;
    const movieId = target.dataset.id;

    api.getMovieInfo(movieId)
        .then((data) => {
            console.log(data);
        });
});

function displayMovies(movies) {
    movies.forEach(({ imdbID: id, Poster: image, Title: title }) => {
        const item = new MovieItem(id, image, title);

        moviesContainer.appendChild(item.render());
    });
}