/**
 * Manages viewport orientation classes and lazy loading of portrait/landscape background images.
 */
export class BackgroundLoader {
    /**
     * @param {{
     *   portraitEl: HTMLElement,
     *   landscapeEl: HTMLElement,
     *   windowRef?: Window,
     *   documentRef?: Document
     * }} options
     */
    constructor({ portraitEl, landscapeEl, windowRef = window, documentRef = document }) {
        this.portraitEl = portraitEl;
        this.landscapeEl = landscapeEl;
        this.windowRef = windowRef;
        this.documentRef = documentRef;
    }

    /**
     * Attaches resize listener and applies initial orientation state.
     */
    init() {
        this.windowRef.addEventListener('resize', () => this.updateOrientation());
        this.updateOrientation();
    }

    /**
     * Updates body orientation classes and ensures the matching background image is loaded.
     */
    updateOrientation() {
        const isPortrait = this.windowRef.innerHeight > this.windowRef.innerWidth;
        this.documentRef.body.classList.toggle('portrait', isPortrait);
        this.documentRef.body.classList.toggle('landscape', !isPortrait);
        this.loadImage(isPortrait ? this.portraitEl : this.landscapeEl);
    }

    /**
     * Lazy-loads a background image from its `data-bg` attribute once.
     * @param {HTMLElement|null} element
     */
    loadImage(element) {
        if (!element || element.dataset.loaded === 'true') {
            return;
        }

        const imageUrl = element.dataset.bg;
        if (!imageUrl) {
            return;
        }

        const img = new this.windowRef.Image();
        img.onload = () => {
            element.dataset.loaded = 'true';
            element.style.backgroundImage = `url('${imageUrl}')`;
        };
        img.src = imageUrl;
    }
}
