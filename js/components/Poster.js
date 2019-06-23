const ERROR_IMG = 'assets/placeholder.png';

export default class Poster{
    constructor(image) {
        this.image = image;
    }

    getElement() {
        const poster = new Image();

        poster.src = this.image;
        
        poster.addEventListener('error', function() {
            poster.src = ERROR_IMG;
        });

        poster.addEventListener('load', function() {
            poster.classList.add('loaded');
        });

        return poster;
    }
}