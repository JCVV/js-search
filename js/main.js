import api from './api.js';
import MovieItem from './components/MovieItem.js';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const moviesContainer = document.querySelector('.movies-grid');
const loader = document.querySelector('.loader');

const searchData = {
    query: '',
    page: 1,
    total: 0
}

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

    api.getMovieInfo(movieId)
        .then((data) => {
            console.log(data);
        });
});

window.addEventListener('scroll', function(event) {
    
  var d = document.documentElement;
  var offset = d.scrollTop + window.innerHeight;
  var height = d.offsetHeight;

  console.log('offset = ' + offset);
  console.log('height = ' + height);

  if (offset >= height - 100) {
      searchData.page += 1;
      searchMovies(searchData.query, searchData.page);
  }
});

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

        moviesContainer.appendChild(item.render());
    });
}

//TODO: REMOVE THIS;

searchMovies('x-men');