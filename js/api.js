const URL = 'http://www.omdbapi.com/';
const API_KEY = 'cfb38312';

export default {
    gethMovies(query) {
        const url = `${URL}?s=${query}&apikey=${API_KEY}`;
        
        return fetch(url)
            .then(response => response.json());
    },
    getMovieInfo(id) {
        const url = `${URL}?i=${id}&apikey=${API_KEY}`;
        
        return fetch(url)
            .then(response => response.json());
    }
};