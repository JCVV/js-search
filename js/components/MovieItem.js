import Poster from './Poster.js';

export default class MovieItem{
    constructor(id, image, title) {
        this.id = id;
        this.image = image;
        this.title = title;
    }

    getElement() {
        const item = document.createElement('div');
        const textContainer = document.createElement('div');
        const poster = new Poster(this.image).getElement();
        const title = document.createElement('div');

        item.dataset.id = this.id;
        item.className = 'movie-item';

        title.textContent = this.title;
        title.className = 'movie-title';

        textContainer.className = 'movie-text-container';

        textContainer.append(title);
        item.append(poster, textContainer);

        return item;
    }
}