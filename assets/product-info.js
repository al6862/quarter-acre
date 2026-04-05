class ProductFeaturedMedia extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.bindedHandleViewClick = this.handleViewClick.bind(this);

    this.querySelectorAll('.views-nav span:is(.first-view, .second-view)')?.forEach((ele) => ele.addEventListener('click', this.bindedHandleViewClick));
  }
  
  disconnectedCallback() {
    this.querySelectorAll('.views-nav span:is(.first-view, .second-view)')?.forEach((ele) => ele.removeEventListener('click', this.bindedHandleViewClick));
  }

  handleViewClick(event) {
    const activeMediaIndex = parseInt(this.querySelector('.product__featured-media.active').dataset.index);
    if (event.currentTarget.classList.contains('first-view')) {
      event.currentTarget.classList.add('active');
      this.querySelector('.second-view').classList.remove('active');

      this.querySelector('.product__featured-media.active').classList.remove('active');
      this.querySelector(`.product__featured-media[data-index="${activeMediaIndex - 1}"]`).classList.add('active');
    } else {
      event.currentTarget.classList.add('active');
      this.querySelector('.first-view').classList.remove('active');

      this.querySelector('.product__featured-media.active').classList.remove('active');
      this.querySelector(`.product__featured-media[data-index="${activeMediaIndex + 1}"]`).classList.add('active');
    }
  }
}

customElements.define('product-featured-media', ProductFeaturedMedia);

class ProductThumbnails extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.mediaThumbnails = this.querySelectorAll('.product__media-thumbnail');
    this.bindedHandleThumbnailClick = this.handleThumbnailClick.bind(this);

    this.mediaThumbnails.forEach((ele) => ele.addEventListener('click', this.bindedHandleThumbnailClick));
  }
  
  disconnectedCallback() {
    this.mediaThumbnails.forEach((ele) => ele.removeEventListener('click', this.bindedHandleThumbnailClick));
  }

  handleThumbnailClick(event) {
    event.currentTarget.scrollIntoView({ behavior: "smooth", container: 'nearest', inline: "center" });

    this.mediaThumbnails.forEach((ele) => {
      if (ele.dataset.index == event.currentTarget.dataset.index) {
        ele.classList.add('active');
      } else {
        ele.classList.remove('active');
      }
    })

    this.closest('product-info').querySelectorAll('.product__featured-media').forEach((ele) => {
      if (ele.dataset.index == event.currentTarget.dataset.index) {
        ele.classList.add('active');
      } else {
        ele.classList.remove('active');
      }
    })
  }
}

customElements.define('product-thumbnails', ProductThumbnails);

class ProductInfo extends HTMLElement {
  constructor() {
    super();
  }
  
  get productForm() {
    return this.querySelector(`product-form`);
  }

  connectedCallback() {
    this.bindedHandleVariantChange = this.handleVariantChange.bind(this);

    this.querySelector('.product__variant-selects')?.addEventListener('change', this.bindedHandleVariantChange);
  }
  
  disconnectedCallback() {
    this.querySelector('.product__variant-selects')?.removeEventListener('change', this.bindedHandleVariantChange);
  }

  handleVariantChange(event) {
    this.resetProductFormState();

    const selectedOptionValues = Array.from(this.querySelectorAll('fieldset input:checked')).map(({ dataset }) => dataset.optionValueId);

    const productUrl = event.target.dataset.productUrl || this.pendingRequestUrl || this.dataset.url;
    this.pendingRequestUrl = productUrl;
    const shouldFetchFullPage = this.dataset.url !== productUrl;

    this.renderProductInfo({
      requestUrl: this.buildRequestUrlWithParams(productUrl, selectedOptionValues, shouldFetchFullPage),
      targetId: event.target.id,
      callback: shouldFetchFullPage
        ? this.handleSwapProduct(productUrl, shouldFetchFullPage)
        : this.handleUpdateProductInfo(productUrl),
    });
  }

  resetProductFormState() {
    this.productForm?.toggleSubmitButton(true);
    this.productForm?.handleErrorMessage();
  }

  buildRequestUrlWithParams(url, optionValues, shouldFetchFullPage = false) {
    const params = [];

    !shouldFetchFullPage && params.push(`section_id=${this.dataset.section}`);

    if (optionValues.length) {
      params.push(`option_values=${optionValues.join(',')}`);
    }

    return `${url}?${params.join('&')}`;
  }

  renderProductInfo({ requestUrl, targetId, callback }) {
    fetch(requestUrl)
      .then((response) => response.text())
      .then((responseText) => {
        this.pendingRequestUrl = null;
        const html = new DOMParser().parseFromString(responseText, 'text/html');
        callback(html);
      })
      .then(() => {
        // set focus to last clicked option value
        document.querySelector(`#${targetId}`)?.focus();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleSwapProduct(productUrl, updateFullPage) {
    return (html) => {
      const variant = this.getSelectedVariant(html.querySelector('product-info'));
      this.updateURL(productUrl, variant?.id);

      if (updateFullPage) {
        document.querySelector('head title').innerHTML = html.querySelector('head title').innerHTML;

        // might have to change later if add scripts to product page since by default, scripts are disabled when using element.innerHTML.
        document.querySelector('main').innerHTML = html.querySelector('main').innerHTML;
      } else {
        document.querySelector('product-info').innerHTML = html.querySelector('product-info').innerHTML;
      }
    };
  }

  handleUpdateProductInfo(productUrl) {
    return (html) => {
      const variant = this.getSelectedVariant(html);
      this.updateURL(productUrl, variant?.id);

      if (!variant) {
        this.setUnavailable();
        return;
      }

      if (variant?.featured_media?.id != this.getSelectedVariant(this)?.featured_media?.id) {
        this.updateMedia(html);
      }


      this.updateOptionValues(html);
      this.updateVariantInputs(variant?.id);
      this.updatePrice(html);

      this.productForm?.toggleSubmitButton(
        html.getElementById(`ProductSubmitButton-${this.dataset.section}`)?.hasAttribute('disabled'),
        'Sold out'
      );
    };
  }

  getSelectedVariant(productInfoNode) {
    const selectedVariant = productInfoNode.querySelector('[data-selected-variant]')?.innerHTML;
    return !!selectedVariant ? JSON.parse(selectedVariant) : null;
  }

  updateURL(url, variantId) {
    window.history.replaceState({}, '', `${url}${variantId ? `?variant=${variantId}` : ''}`);
  }

  updateOptionValues(html) {
    const variantSelects = html.querySelector('.product__variant-selects');
    if (variantSelects && this.querySelector('.product__variant-selects')) {
      this.querySelector('.product__variant-selects').innerHTML = variantSelects.innerHTML;
    }
  }

  updateVariantInputs(variantId) {
    this.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment-${this.dataset.section}`).forEach((productForm) => {
      productForm.querySelector('input[name="id"]').value = variantId ?? '';
    });
  }

  updatePrice(html) {
    const price = html.querySelector('.product__price');
    if (price && this.querySelector('.product__price')) {
      this.querySelector('.product__price').innerHTML = price.innerHTML;
    }
  }

  setUnavailable() {
    this.productForm?.toggleSubmitButton(true, 'Unavailable');
  }

  updateMedia(html) {
    this.mediaGallerySource = this.querySelector('.product__featured-media-container');
    this.mediaGalleryDestination = html.querySelector(".product__featured-media-container");
    if (this.mediaGallerySource && this.mediaGalleryDestination) {
      this.mediaGallerySource.innerHTML = this.mediaGalleryDestination.innerHTML;
    };

    this.mediaThumbnailsSource = this.querySelector('.product__media-thumbnails-container');
    this.mediaThumbnailsDestination = html.querySelector(".product__media-thumbnails-container");
    if (this.mediaThumbnailsSource && this.mediaThumbnailsDestination) {
      this.mediaThumbnailsSource.innerHTML = this.mediaThumbnailsDestination.innerHTML;
    };
  }
}

customElements.define('product-info', ProductInfo);
