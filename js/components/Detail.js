export default class Detail {
    constructor(element) {
        this.element = element;
        this.closeButton = element.querySelector('.close-button');
        this.title = element.querySelector('.title');
        this.extraInfo = element.querySelector('.extra-info');
        this.description = element.querySelector('.description');
        this.player = element.querySelector('.player');

        this.setListeners();
        this.resetData();
    }

    /**
     * Method to add the click listeners to close the window
     * by event delegation when clicking the close button 
     * or in the outside part of the modal.
     */
    setListeners() {
        this.element.addEventListener('click', (event) => {
            const target = event.target;

            if (target === this.closeButton || target === this.element) {
                this.close();
            }
        })
    }

    close() {
        document.body.classList.remove('modal-open');
        this.element.classList.add('hidden');
        this.player.load();
        this.resetData();
    }

    open() {
        this.element.classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    resetData() {
        this.title.textContent = 'Loading...';
        this.description.textContent = '';
        this.extraInfo.textContent = '';
        this.player.classList.add('hidden');
    }

    /**
     * Method to update the view with the movie info.
     * Using renaming vars in order to not use variables with capital letters.
     * @param {Object} param0 Movie object
     */
    setData({
        Title: title,
        Plot: plot,
        Year: year,
        Language: language
    }) {
        this.title.textContent = title;
        this.description.textContent = plot;
        this.extraInfo.textContent = `Year: ${year} | Language: ${language}`;
        this.player.classList.remove('hidden');
        this.player.play();
    }

    setErrorData() {
        this.title.textContent = 'Error loading the info...';
        this.description.textContent = '';
    }
}