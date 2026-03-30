class CartRemoveButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.bindedHandleRemoveButtonClick = this.handleRemoveButtonClick.bind(this);

    this.addEventListener('click', this.bindedHandleRemoveButtonClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.bindedHandleRemoveButtonClick);
  }

  handleRemoveButtonClick(event) {
    event.preventDefault();

    const body = JSON.stringify({
      line: this.dataset.index,
      quantity: 0,
      sections: ['header', 'cart-drawer'],
      sections_url: window.location.pathname,
    });

    fetch(`${routes.cart_change_url}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: `application/json`}, ...{ body } })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (response.errors) {
          const errors = document.getElementById('cart-errors');
          errors.textContent = response.errors;
          return;
        }

        const newCart = new DOMParser().parseFromString(response.sections["cart-drawer"], "text/html");
        document.querySelector('.cart-drawer__container').innerHTML = newCart.querySelector('.cart-drawer__container').innerHTML;

        const newHeader = new DOMParser().parseFromString(response.sections["header"], "text/html");
        document.querySelector('.header__cart').innerHTML = newHeader.querySelector('.header__cart').innerHTML;
      })
      .catch(() => {
        const errors = document.getElementById('cart-errors');
        errors.textContent = 'Error occured while updating cart.';
      })
  }
}

customElements.define('cart-remove-button', CartRemoveButton);

class CartDrawer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.cartButton = document.querySelector('.header__cart');
    this.closeCartButton = this.querySelector('.close-cart-drawer-button');
    this.cartContainer = this.querySelector('.cart-drawer__container');

    this.bindedHandleKeyUp = this.handleKeyUp.bind(this);
    this.bindedHandleClick = this.handleClick.bind(this);
    this.bindedHandleTransitionEnd = this.handleTransitionEnd.bind(this);


    this.cartButton.addEventListener('click', this.bindedHandleClick);
    this.addEventListener('click', this.bindedHandleClick);

    this.cartContainer.addEventListener('transitionend', this.bindedHandleTransitionEnd);

    this.cartButton.addEventListener('keyup', this.bindedHandleKeyUp);
    this.addEventListener('keyup', this.bindedHandleKeyUp);
  }

  disconnectedCallback() {
    this.cartButton.removeEventListener('click', this.bindedHandleClick);
    this.removeEventListener('click', this.bindedHandleClick);
    this.cartContainer.removeEventListener('transitionend', this.bindedHandleTransitionEnd);
    this.cartButton.removeEventListener('keyup', this.bindedHandleKeyUp);
    this.removeEventListener('keyup', this.bindedHandleKeyUp);
  }

  handleTransitionEnd(event) {
    if (this.classList.contains('closing')) {
      this.classList.remove('closing');
      this.classList.remove('open');
    }
  }

  handleKeyUp(event) {
    if (event.key !== 'Escape') return;

    this.close();
  }

  handleClick(event) {
    if (event.target.closest('.close-cart-drawer-button') || !event.target.closest('.cart-drawer__container')) {
      this.classList.contains('open')? this.close() : this.open();
    }
  }

  open() {
    this.classList.add('open');
    this.cartButton.setAttribute('aria-expanded', 'true');
    this.closeCartButton.setAttribute('aria-expanded', 'true');
  }

  close() {
    this.classList.add('closing');
    this.cartButton.setAttribute('aria-expanded', 'false');
    this.closeCartButton.setAttribute('aria-expanded', 'false');
  }
}

customElements.define('cart-drawer', CartDrawer);
