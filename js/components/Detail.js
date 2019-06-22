export default class Detail{
    constructor(element) {
        this.element = element;
        this.closeButton = element.querySelector('.close-button');
        this.title = element.querySelector('.title');
        this.description = element.querySelector('.description');
        this.player = element.querySelector('#player');

        this.setListeners();
    }

    setListeners() {
        this.closeButton.addEventListener('click', () => {
            this.close();
        });
    }

    close() {
        this.element.classList.add('hidden');
        document.body.classList.remove('modal-open');
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
        this.player.classList.add('hidden');
    }

    setData(title, description) {
        this.title.textContent = title;
        this.description.textContent = description;
        this.player.classList.remove('hidden');
    }

    setErrorData() {
        this.title.textContent = title;
        this.description.textContent = description;
    }

}