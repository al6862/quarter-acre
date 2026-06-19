class ProductFeaturedMedia extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.bindedHandleViewClick = this.handleViewClick.bind(this);
    this.bindedHandleChangeViewClick = this.handleChangeViewClick.bind(this);
    this.bindedHandleScroll = this.handleScroll.bind(this);

    this.querySelectorAll('.views-nav span:is(.first-view, .second-view)')?.forEach((ele) => ele.addEventListener('click', this.bindedHandleViewClick));
    this.querySelector('.views-nav__change-view').addEventListener('click', this.bindedHandleChangeViewClick);
    this.addEventListener('scroll', this.bindedHandleScroll);
  }
  
  disconnectedCallback() {
    this.querySelectorAll('.views-nav span:is(.first-view, .second-view)')?.forEach((ele) => ele.removeEventListener('click', this.bindedHandleViewClick));
    this.querySelector('.views-nav__change-view').removeEventListener('click', this.bindedHandleChangeViewClick);
    this.removeEventListener('scrollend', this.bindedHandleScroll);
  }

  handleViewClick(event) {
    if (event.currentTarget.classList.contains('first-view')) {
      event.currentTarget.classList.add('active');
      this.querySelector('.second-view').classList.remove('active');
      this.changeToFirstView();
    } else {
      event.currentTarget.classList.add('active');
      this.querySelector('.first-view').classList.remove('active');
      this.changeToSecondView();
    }
  }

  handleChangeViewClick(event) {
    if (this.querySelector('.second-view').classList.contains('active')) {
      this.querySelector('.first-view').classList.add('active');
      this.querySelector('.second-view').classList.remove('active');
      this.changeToFirstView();
    } else {
      this.querySelector('.second-view').classList.add('active');
      this.querySelector('.first-view').classList.remove('active');
      this.changeToSecondView();
    }
  }

  changeToFirstView() {
    this.querySelectorAll('.product__featured-media :is(img, video):not(:first-child)').forEach(ele => ele.classList.remove('active'));
    this.querySelectorAll('.product__featured-media :is(img, video):first-child').forEach(ele => ele.classList.add('active'));

    this.closest('product-info').querySelectorAll('.product__media-thumbnail :is(img, video):not(:first-child)').forEach(ele => ele.classList.remove('active'));
    this.closest('product-info').querySelectorAll('.product__media-thumbnail :is(img, video):first-child').forEach(ele => ele.classList.add('active'));
  }

  changeToSecondView() {
    this.querySelectorAll('.product__featured-media :is(img, video):not(:first-child)').forEach(ele => ele.classList.add('active'));
    this.querySelectorAll('.product__featured-media :is(img, video):first-child').forEach(ele => ele.classList.remove('active'));

    this.closest('product-info').querySelectorAll('.product__media-thumbnail :is(img, video):not(:first-child)').forEach(ele => ele.classList.add('active'));
    this.closest('product-info').querySelectorAll('.product__media-thumbnail :is(img, video):first-child').forEach(ele => ele.classList.remove('active'));
  }

  handleScroll(event) {
    const newActiveIndex = Math.round(this.scrollLeft / this.offsetWidth);

    this.querySelector('.product__featured-media.active').classList.remove('active');
    this.querySelector(`.product__featured-media[data-index='${newActiveIndex}']`).classList.add('active');

    this.closest('product-info').querySelector('.product__media-thumbnail.active').classList.remove('active');
    this.closest('product-info').querySelector(`.product__media-thumbnail[data-index='${newActiveIndex}']`).classList.add('active');
    if (window.innerWidth >= 990) {
      this.closest('product-info').querySelector(`.product__media-thumbnail[data-index='${newActiveIndex}']`).scrollIntoView({ behavior: "smooth", container: 'nearest', inline: "center" });
    }

    this.querySelector('.pag .current-slide').textContent = newActiveIndex + 1;
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
    this.closest('product-info').querySelector('product-featured-media').removeEventListener('scroll', this.closest('product-info').querySelector('product-featured-media').bindedHandleScroll);
    this.mediaThumbnails.forEach((ele) => {
      if (ele.dataset.index == event.currentTarget.dataset.index) {
        ele.classList.add('active');
      } else {
        ele.classList.remove('active');
      }
    })

    this.closest('product-info').querySelectorAll('.product__featured-media').forEach((ele) => {
      if (ele.dataset.index == event.currentTarget.dataset.index) {
        ele.scrollIntoView({ behavior: "smooth", container: 'nearest', inline: "center" });
      }
    })

    if (window.innerWidth >= 990) {
      event.currentTarget.scrollIntoView({ behavior: "smooth", container: 'nearest', inline: "center" });
    }

    this.closest('product-info').querySelector('product-featured-media').querySelector('.pag .current-slide').textContent = parseInt(event.currentTarget.dataset.index) + 1;
    this.closest('product-info').querySelector('product-featured-media').addEventListener('scrollend', () => {
      this.closest('product-info').querySelector('product-featured-media').addEventListener('scroll', this.closest('product-info').querySelector('product-featured-media').bindedHandleScroll);
    }, {once: true});
  }
}

customElements.define('product-thumbnails', ProductThumbnails);

class OptionSelect extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.bindedHandleClick = this.handleClick.bind(this);
    this.bindedHandleCheckedClick = this.handleCheckedClick.bind(this);
    this.querySelector('input:checked + label').addEventListener('click', this.bindedHandleCheckedClick);
    this.querySelectorAll('input:not(:checked) + label').forEach((ele) => ele.addEventListener('click', this.bindedHandleClick));
  }
  
  disconnectedCallback() {
    this.querySelector('input:checked + label').removeEventListener('click', this.bindedHandleCheckedClick);
    this.querySelectorAll('input:not(:checked) + label').forEach((ele) => ele.removeEventListener('click', this.bindedHandleClick));
  }

  handleClick(event) {
    this.closest('product-info').querySelectorAll('option-select').forEach((ele) => {
      this.classList.remove('open');
      this.setAttribute('aria-expanded', 'false');
    });
  }

  handleCheckedClick() {
    if (this.classList.contains('open')) {
      this.classList.remove('open');
      this.setAttribute('aria-expanded', 'false');
    } else {
      this.classList.add('open');
      this.setAttribute('aria-expanded', 'true');
    }
  }
}

customElements.define('option-select', OptionSelect);

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

    document.querySelectorAll('product-info').forEach((ele) => {
      ele.renderProductInfo({
        requestUrl: ele.buildRequestUrlWithParams(productUrl, selectedOptionValues, shouldFetchFullPage),
        targetId: event.target.id,
        callback: shouldFetchFullPage
          ? ele.handleSwapProduct(productUrl, shouldFetchFullPage)
          : ele.handleUpdateProductInfo(productUrl),
      });
    })
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
        document.querySelectorAll('product-info').forEach((ele, i) => {
          ele.innerHTML = Array.from(html.querySelectorAll('product-info'))[i].innerHTML;
        })
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
