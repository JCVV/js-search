import Poster from './Poster.js';

export default class MovieItem{
    constructor(id, image, title) {
        this.id = id;
        this.image = image;
        this.title = title;
    }

    render() {
        const item = document.createElement('div');
        const poster = new Poster(this.image).render();
        const title = document.createElement('div');

        item.dataset.id = this.id;
        item.className = 'movie-item';

        title.textContent = this.title;
        title.className = 'movie-title';

        item.append(poster, title);

        return item;
    }
}