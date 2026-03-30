class ProductForm extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.submitButton = this.querySelector('[type="submit"]');
    this.form = this.querySelector('form');
    this.cart = document.getElementById('cart-drawer');
    
    this.bindedHandleSubmit = this.handleSubmit.bind(this);
    this.form.addEventListener('submit', this.bindedHandleSubmit);
  }

  disconnectedCallback() {
    this.form.removeEventListener('submit', this.bindedHandleSubmit);
  }

  handleSubmit(evt) {
    evt.preventDefault();
    if (this.submitButton.hasAttribute('disabled')) return;

    this.handleErrorMessage();

    this.submitButton.setAttribute('disabled', 'disabled');
    this.submitButton.classList.add('loading');

    const config = 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/javascript' },
      };
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);
    formData.append('sections',['header', 'cart-drawer']);
    formData.append('sections_url', window.location.pathname);
    config.body = formData;

    fetch(`${routes.cart_add_url}`, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.status) {
          this.error = true;
          this.handleErrorMessage(response.description);
          this.submitButton.setAttribute('disabled', 'disabled');
          return;
        }
 
        this.error = false;
        
        const newCart = new DOMParser().parseFromString(response.sections["cart-drawer"], "text/html");
        document.querySelector('.cart-drawer__container').innerHTML = newCart.querySelector('.cart-drawer__container').innerHTML;

        const newHeader = new DOMParser().parseFromString(response.sections["header"], "text/html");
        document.querySelector('.header__cart').innerHTML = newHeader.querySelector('.header__cart').innerHTML;
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        if (!this.error) {
          this.cart.open();
        }
        this.submitButton.removeAttribute('disabled');
      });
  }

  handleErrorMessage(errorMessage = false) {
    this.querySelector('.product-form__error-message-wrapper').toggleAttribute('hidden', !errorMessage);

    if (errorMessage) {
      this.querySelector('.product-form__error-message').textContent = errorMessage;
    }
  }

  toggleSubmitButton(disable = true, text) {
    if (disable) {
      this.submitButton.setAttribute('disabled', 'disabled');
      if (text) this.submitButton.querySelector('.product__atb-text').textContent = text;
    } else {
      this.submitButton.removeAttribute('disabled');
      this.submitButton.querySelector('.product__atb-text').textContent = 'Add to Bag';
    }
  }
}

customElements.define('product-form', ProductForm);
