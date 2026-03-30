/**
 * A custom element that manages the main menu drawer.
 */
class HeaderDrawer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.mobileMenu = this.querySelector('.header__mobile-menu');
    this.mobileMenuContainer = this.querySelector('.header__mobile-menu-container');
    this.openButton = this.querySelector('.open-menu-button');
    this.bindedHandleKeyUp = this.handleKeyUp.bind(this);
    this.bindedHandleClick = this.handleClick.bind(this);

    this.addEventListener('keyup', this.bindedHandleKeyUp);
    this.mobileMenuContainer.addEventListener('click', this.bindedHandleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('keyup', this.bindedHandleKeyUp);
    this.mobileMenuContainer.removeEventListener('click', this.bindedHandleClick);
  }

  /**
   * Close the main menu drawer when the Escape key is pressed
   */
  handleKeyUp = (event) => {
    if (event.key !== 'Escape') return;

    this.close();
  };

  /**
   * Open menu when menu button clicked
   */
  handleClick = (event) => {
    if (!event.target.closest('.header__mobile-menu')) {
      this.mobileMenu.classList.contains('open')? this.close() : this.open();
    }
  }

  /**
   * Open the closest drawer or the main menu drawer
   */
  open() {
    this.openButton.setAttribute('aria-expanded', 'true');
    this.mobileMenu.classList.add('open');
  }

  /**
   * Close the closest menu or submenu that is open
   */
  close() {
    this.openButton.setAttribute('aria-expanded', 'false');
    this.mobileMenu.classList.remove('open');
  }
}

customElements.define('header-drawer', HeaderDrawer);

class DesktopReviewSlideshow extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.activeIndex = 0;
    this.lastIndex = this.dataset.lastIndex;
    this.bindedHandlePrevClick = this.handlePrevClick.bind(this);
    this.bindedHandleNextClick = this.handleNextClick.bind(this);

    this.querySelector('.pagination .prev-arrow').addEventListener('click', this.bindedHandlePrevClick);
    this.querySelector('.pagination .next-arrow').addEventListener('click', this.bindedHandleNextClick);
  }

  disconnectedCallback() {
    this.querySelector('.pagination .prev-arrow').removeEventListener('click', this.bindedHandlePrevClick);
    this.querySelector('.pagination .next-arrow').removeEventListener('click', this.bindedHandleNextClick);
  }

  handlePrevClick(event) {
    if (this.activeIndex > 0) {
      this.querySelector(`.review__name[data-index="${this.activeIndex}"]`).classList.remove('active');
      this.querySelector(`.review__name[data-index="${this.activeIndex - 1}"]`).classList.add('active');
      this.querySelector(`.review__quote[data-index="${this.activeIndex}"]`).classList.remove('active');
      this.querySelector(`.review__quote[data-index="${this.activeIndex - 1}"]`).classList.add('active');
      this.querySelector(`.review__image[data-index="${this.activeIndex}"]`).classList.remove('active');
      this.querySelector(`.review__image[data-index="${this.activeIndex - 1}"]`).classList.add('active');

      this.activeIndex = this.activeIndex - 1 ;
      this.querySelector('.pagination .active-review').textContent = this.activeIndex + 1;
      event.currentTarget.removeAttribute('disabled');
    } else {
      event.currentTarget.setAttribute('disabled', 'disabled');
    }
  }

  handleNextClick(event) {
    if (this.activeIndex < this.lastIndex) {
      this.querySelector(`.review__name[data-index="${this.activeIndex}"]`).classList.remove('active');
      this.querySelector(`.review__name[data-index="${this.activeIndex + 1}"]`).classList.add('active');
      this.querySelector(`.review__quote[data-index="${this.activeIndex}"]`).classList.remove('active');
      this.querySelector(`.review__quote[data-index="${this.activeIndex + 1}"]`).classList.add('active');
      this.querySelector(`.review__image[data-index="${this.activeIndex}"]`).classList.remove('active');
      this.querySelector(`.review__image[data-index="${this.activeIndex + 1}"]`).classList.add('active');

      this.activeIndex = this.activeIndex + 1 ;
      this.querySelector('.pagination .active-review').textContent = this.activeIndex + 1;
      event.currentTarget.removeAttribute('disabled');
    } else {
      event.currentTarget.setAttribute('disabled', 'disabled');
    }
  }
}

customElements.define('desktop-review-slideshow', DesktopReviewSlideshow);

class MobileReviewSlideshow extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.bindedHandleSlideClick = this.handleSlideClick.bind(this);

    this.querySelectorAll('.mobile-review-slides .review').forEach((ele) => ele.addEventListener('click', this.bindedHandleSlideClick));
  }

  disconnectedCallback() {
    this.querySelectorAll('.mobile-review-slides .review').forEach((ele) => ele.removeEventListener('click', this.bindedHandleSlideClick));
  }

  handleSlideClick(event) {
    console.log('clicked')
    this.querySelector('.mobile-big-review .review.active').classList.remove('active');
    this.querySelector(`.mobile-big-review .review[data-index="${event.currentTarget.dataset.index}"]`).classList.add('active');
  }
}

customElements.define('mobile-review-slideshow', MobileReviewSlideshow);