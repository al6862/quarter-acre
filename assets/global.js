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
    this.closeButton = this.querySelector('.close-menu-button')
    this.bindedHandleKeyUp = this.handleKeyUp.bind(this);
    this.bindedHandleClick = this.handleClick.bind(this);
    this.bindedHandleScroll = this.handleScroll.bind(this);

    this.addEventListener('keyup', this.bindedHandleKeyUp);
    this.mobileMenuContainer.addEventListener('click', this.bindedHandleClick);
    window.addEventListener('scroll', this.bindedHandleScroll);
  }

  disconnectedCallback() {
    this.removeEventListener('keyup', this.bindedHandleKeyUp);
    this.mobileMenuContainer.removeEventListener('click', this.bindedHandleClick);
    window.removeEventListener('scroll', this.bindedHandleScroll);
  }

  handleScroll() {
    if(window.scrollY == 0){
      this.classList.remove('scrolled');
    } else {
      this.classList.add('scrolled');
    }
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
    if (!event.target.closest('.header__mobile-menu') || event.target.closest('.close-menu-button')) {
      this.mobileMenu.classList.contains('open')? this.close() : this.open();
    }
  }

  /**
   * Open the closest drawer or the main menu drawer
   */
  open() {
    this.openButton.setAttribute('aria-expanded', 'true');
    this.closeButton.setAttribute('aria-expanded', 'true');
    this.mobileMenu.classList.add('open');
  }

  /**
   * Close the closest menu or submenu that is open
   */
  close() {
    this.openButton.setAttribute('aria-expanded', 'false');
    this.closeButton.setAttribute('aria-expanded', 'false');
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
    this.querySelector('.mobile-big-review .review.active').classList.remove('active');
    this.querySelector(`.mobile-big-review .review[data-index="${event.currentTarget.dataset.index}"]`).classList.add('active');
  }
}

customElements.define('mobile-review-slideshow', MobileReviewSlideshow);

class DrawersElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.drawerHeadings = this.querySelectorAll('.drawers-element__desktop .drawers-element__heading');
    this.drawerBlocks = this.querySelectorAll('.drawers-element__desktop .drawers-element__block');
    this.marker = this.querySelector('.drawers-element__desktop .marker');
    this.detailSummaries = this.querySelectorAll('.drawers-element__mobile summary');

    this.bindedHandleDesktopClick = this.handleDesktopClick.bind(this);
    this.bindedHandleMobileClick = this.handleMobileClick.bind(this);
    this.bindedHandleObserve = this.handleObserve.bind(this);

    const options = {
      rootMargin: "-54px 0px 0px 0px",
    };
    this.observer = new IntersectionObserver(this.bindedHandleObserve, options);
    this.drawerBlocks.forEach((ele) => this.observer.observe(ele));

    this.drawerHeadings.forEach((ele) => ele.addEventListener('click', this.bindedHandleDesktopClick));
    this.detailSummaries.forEach((ele) => ele.addEventListener('click', this.bindedHandleMobileClick));
  }

  disconnectedCallback() {
    this.observer.disconnect();
    this.drawerHeadings.forEach((ele) => ele.removeEventListener('click', this.bindedHandleDesktopClick));
    this.detailSummaries.forEach((ele) => ele.removeEventListener('click', this.bindedHandleMobileClick));
  }

  handleObserve(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currIndex = entry.target.dataset.index;

        this.marker.style.top = `calc(1.375rem + (2.75rem + 1px) * ${currIndex} - 0.5 * 0.5625rem)`;

        this.drawerHeadings.forEach((ele) => {
          if (ele.dataset.index == currIndex) {
            ele.classList.add('active');
          } else {
            ele.classList.remove('active');
          }
        })
      }
    });
  }

  handleDesktopClick(event) {
    const currIndex = event.currentTarget.dataset.index;

    this.marker.style.top = `calc(1.375rem + (2.75rem + 1px) * ${currIndex} - 0.5 * 0.5625rem)`;

    this.drawerHeadings.forEach((ele) => {
      if (ele.dataset.index == currIndex) {
        ele.classList.add('active');
      } else {
        ele.classList.remove('active');
      }
    })

    this.drawerBlocks.forEach((ele) => {
      if (ele.dataset.index == currIndex) {
        ele.scrollIntoView({block: 'start', behavior: 'smooth'})
      }
    })
  }

  handleMobileClick(event) {
    event.preventDefault();
    const details = event.currentTarget.closest('details');
    if (details.hasAttribute('open')) {
      details.classList.remove('open');
      details.querySelector('.drawers-element__container').addEventListener('transitionend', () => {
        details.removeAttribute('open');
      }, {once: true});
    } else {
      details.setAttribute('open', '');
      setTimeout(() => details.classList.add('open'));
    }
  }
}

customElements.define('drawers-element', DrawersElement);

class FAQElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.drawerHeadings = this.querySelectorAll('.faq__nav > a');
    this.drawerBlocks = this.querySelectorAll('.faq-question__heading');
    this.marker = this.querySelector('.faq__nav .marker');
    this.detailSummaries = this.querySelectorAll('.faq__questions summary');

    this.bindedHandleHeadingClick = this.handleHeadingClick.bind(this);
    this.bindedHandleSummaryClick = this.handleSummaryClick.bind(this);
    this.bindedHandleObserve = this.handleObserve.bind(this);

    const options = {
      rootMargin: "-54px 0px 0px 0px",
    };
    this.observer = new IntersectionObserver(this.bindedHandleObserve, options);
    this.drawerBlocks.forEach((ele) => this.observer.observe(ele));

    this.drawerHeadings.forEach((ele) => ele.addEventListener('click', this.bindedHandleHeadingClick));
    this.detailSummaries.forEach((ele) => ele.addEventListener('click', this.bindedHandleSummaryClick));
  }

  disconnectedCallback() {
    this.observer.disconnect();
    this.drawerHeadings.forEach((ele) => ele.removeEventListener('click', this.bindedHandleHeadingClick));
    this.detailSummaries.forEach((ele) => ele.removeEventListener('click', this.bindedHandleSummaryClick));
  }

  handleObserve(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currIndex = entry.target.dataset.index;

        this.marker.style.top = `calc(1.375rem + (2.75rem + 1px) * ${currIndex} - 0.5 * 0.5625rem)`;

        this.drawerHeadings.forEach((ele) => {
          if (ele.dataset.index == currIndex) {
            ele.classList.add('active');
          } else {
            ele.classList.remove('active');
          }
        })
      }
    });
  }

  handleHeadingClick(event) {
    const currIndex = event.currentTarget.dataset.index;

    this.marker.style.top = `calc(1.375rem + (2.75rem + 1px) * ${currIndex} - 0.5 * 0.5625rem)`;

    this.drawerHeadings.forEach((ele) => {
      if (ele.dataset.index == currIndex) {
        ele.classList.add('active');
      } else {
        ele.classList.remove('active');
      }
    })
  }

  handleSummaryClick(event) {
    event.preventDefault();
    const details = event.currentTarget.closest('details');
    if (details.hasAttribute('open')) {
      details.classList.remove('open');
      details.querySelector('.faq-question__content-container').addEventListener('transitionend', () => {
        details.removeAttribute('open');
      }, {once: true});
    } else {
      details.setAttribute('open', '');
      setTimeout(() => details.classList.add('open'));
    }
  }
}

customElements.define('faq-element', FAQElement);


class StickyNav extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.bindedHandleObserve = this.handleObserve.bind(this);
    const options = {
      rootMargin: "-54px 0px 0px 0px",
    };

    const observer = new IntersectionObserver(this.bindedHandleObserve, options);
    observer.observe(document.querySelector('.main-product'));
  }

  handleObserve(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
    });
  }
}

customElements.define('sticky-nav', StickyNav);

class IncludeRunModal extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.openButton = this.querySelector('button[aria-label="open"]');
    this.closeButton = this.querySelector('button[aria-label="close"]');
    this.dialog = this.querySelector('dialog');
    this.handleClick = this.handleClick.bind(this);


    this.addEventListener('click', this.handleClick);
  }

  disconnectedCallback() {

  }

  handleClick(event) {
    event.preventDefault();
    if (!event.target.closest('.include-run-modal__dialog') || event.target.closest('.include-run-modal__close-button')) {
      if (this.dialog.hasAttribute('open')) {
        this.dialog.classList.remove('open');
        this.addEventListener('transitionend', () => {
          this.dialog.removeAttribute('open');
        }, {once: true});
      } else {
        this.dialog.setAttribute('open', 'open');
        setTimeout(() => {this.dialog.classList.add('open')});
      }
    }
  }
}

customElements.define('include-run-modal', IncludeRunModal);

class ImageGrid extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.blocks = Array.from(this.querySelectorAll('.image-grid__block'));
    this.thumbnails = Array.from(this.querySelectorAll('.image-grid__thumbnails > *'));
    this.handleClick = this.handleClick.bind(this);

    this.thumbnails.forEach(ele => ele.addEventListener('click', this.handleClick));
  }

  disconnectedCallback() {
    this.thumbnails.forEach(ele => ele.removeEventListener('click', this.handleClick));
  }

  handleClick(event) {
    const newIndex = this.thumbnails.indexOf(event.currentTarget);
    this.thumbnails.forEach(ele => ele.classList.remove('active'));
    event.currentTarget.classList.add('active');

    this.blocks.forEach(ele => ele.classList.remove('active'));
    this.blocks[newIndex].classList.add('active');
  }
}

customElements.define('image-grid', ImageGrid);
