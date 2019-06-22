export default class Poster{
    constructor(image) {
        this.image = image;
    }

    render() {
        const poster = new Image();

        poster.src = this.image;
        poster.addEventListener('error', function() {
            poster.src = 'assets/placeholder.png';
            console.log('error loading image');
        })

        return poster;
    }
}