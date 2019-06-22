import api from './api.js';
import MovieItem from './components/MovieItem.js';
import Detail from './components/Detail.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const moviesContainer = document.querySelector('.movies-grid');
const loader = document.querySelector('.loader');
const detail = document.querySelector('.detail');
const detailModal = new Detail(detail);

const searchData = {
    query: '',
    page: 1,
    total: 0
}

function initApp() {
    addListeners();
}

function addListeners() {

    form.addEventListener('submit', (event) => {
        const query = input.value;

        searchData.query = query;
        searchData.page = 1;
        searchData.total = 0;

        event.preventDefault();

        moviesContainer.innerHTML = '';
        loader.style.display = 'block';

        searchMovies(query);
    });

    moviesContainer.addEventListener('click', (event) => {
        const target = event.target;
        const movieId = target.dataset.id;

        detailModal.open();
        api.getMovieInfo(movieId)
            .then((data) => {
                detailModal.setData(data.Title, data.Plot);
                console.log(data);
            });
    });

    window.addEventListener('scroll', function (event) {
        const d = document.documentElement;
        const offset = d.scrollTop + window.innerHeight;
        const height = d.offsetHeight;

        console.log('offset = ' + offset);
        console.log('height = ' + height);

        if (offset >= height - 100) {
            searchData.page += 1;
            searchMovies(searchData.query, searchData.page);
        }
    });
}

function searchMovies(query, page = 1) {
    api.gethMovies(query, page)
        .then((movies) => {
            displayMovies(movies.Search);
        });
}

function displayMovies(movies) {
    loader.style.display = 'none';
    movies.forEach(({ imdbID: id, Poster: image, Title: title }) => {
        const item = new MovieItem(id, image, title);

        moviesContainer.appendChild(item.getElement());
    });
}

initApp();