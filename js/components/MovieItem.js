export default class MovieItem{
    constructor(id, image, title) {
        this.id = id;
        this.image = image;
        this.title = title;
    }

    render() {
        const item = document.createElement('div');
        const poster = new Image();
        const title = document.createElement('h2');

        item.dataset.id = this.id;
        item.className = 'movie-item';

        poster.src = this.image;

        title.textContent = this.title;

        item.append(poster, title);

        return item;
    }
}