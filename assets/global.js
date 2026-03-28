/**
 * A custom element that manages the main menu drawer.
 */
class HeaderDrawer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.mobileMenu = this.querySelector('.header__mobile-menu');
    this.openButton = this.querySelector('.open-menu-button');
    this.bindedHandleKeyUp = this.handleKeyUp.bind(this);
    this.bindedHandleClick = this.handleClick.bind(this);

    this.addEventListener('keyup', this.bindedHandleKeyUp);
    this.addEventListener('click', this.bindedHandleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('keyup', this.bindedHandleKeyUp);
    this.removeEventListener('click', this.bindedHandleClick);
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
