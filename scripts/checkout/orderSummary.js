import { cart, removeFromCart, calculateCartQuantity, updateQuantity, updateDeliveryOption } from '../../data/cart.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDays, isWeekend } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export function renderOrderSummary() {

    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

        const dateString = calculateDeliveryDays(deliveryOption);

        cartSummaryHTML +=
            `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                      Delivery Date: <span class = "change-delivery-date js-change-delivery-date-${matchingProduct.id}">
                      ${dateString}</span>
                    </div>

                    <div class="cart-item-details-grid">
                      <img class="product-image"
                        src='${matchingProduct.image}'>

                      <div class="cart-item-details">
                        <div class="product-name">
                          ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                          $${formatCurrency(matchingProduct.priceCents)}
                        </div>
                        <div class="product-quantity">
                          <span>
                            Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                          </span>
                          <span class="update-quantity-link link-primary js-update-link"
                                data-product-id = "${matchingProduct.id}">
                            Update
                          </span>
                          <input class = "input-quantity js-input-quantity js-input-quantity-${matchingProduct.id}"
                                data-product-id = '${matchingProduct.id}'>
                          <span class = "save-quantity-link link-primary js-save-quantity-link"
                                data-product-id = '${matchingProduct.id}'>
                                Save
                                </span>
                          <span class="delete-quantity-link link-primary js-delete-link"
                            data-product-id = "${matchingProduct.id}">
                            Delete
                          </span>
                        </div>
                    </div>
                    <div class="delivery-options" >
                         <div class="delivery-options-title">
                             Choose a delivery option: ${deliveryOptionsHTML(matchingProduct, cartItem)}
                         </div >
                    </div>
                </div>
            </div>
             `;
    });

    function deliveryOptionsHTML(matchingProduct, cartItem) {

        let html = '';
        deliveryOptions.forEach((option) => {
            const dateString = calculateDeliveryDays(option);
            const priceString = option.priceCents === 0 ? 'Free' : `$${formatCurrency(option.priceCents)} -`;
            const isChecked = option.id === cartItem.deliveryOptionId;
            html += `
            <div class="delivery-option js-delivery-option"
                 data-product-id = "${matchingProduct.id}"
                 data-delivery-option-id = "${option.id}">
                          <input type="radio"
                            ${isChecked ? 'checked' : ''}
                            class="delivery-option-input"
                            name="delivery-option-${matchingProduct.id}">
                          <div>
                            <div class="delivery-option-date .js-delivery-option-date">
                              ${dateString}
                            </div>
                            <div class="delivery-option-price">
                              ${priceString} Shipping
                            </div>
                          </div>
                        </div>
            `;
        });
        return html;
    }

    function updateCartQuantity() {
        const cartQuantity = calculateCartQuantity() || 'No items in the cart';
        document.querySelector('.js-return-to-home-link')
            .innerHTML = `${cartQuantity} items`;
    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

    updateCartQuantity();

    document.querySelectorAll('.js-update-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.classList.add('is-editing-quantity');
        });
    });
    function onClickSave(productId) {

        const newQty = Number(document.querySelector(`.js-input-quantity-${productId}`).value);
        if (newQty <= 0 || newQty >= 1000) {
            alert('Quantity must be at least 1 and less than 1000');
            return;
        }
        updateQuantity(productId, newQty);
        document.querySelector(`.js-input-quantity-${productId}`).value = ''
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');
        document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQty;
        updateCartQuantity();
        updateCartQty();
    }

    document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
        link.addEventListener('click', () => {
            const productId = link.dataset.productId;
            onClickSave(productId);
            renderOrderSummary();
            renderPaymentSummary();
        });
    });

    document.querySelectorAll('.js-delete-link').forEach((link) => {
        link.addEventListener('click', () => {

            const productId = link.dataset.productId;
            removeFromCart(productId);
            /*
            const container = document.querySelector(`.js-cart-item-container-${productId}`);
            container.remove();
            */
            updateCartQuantity();
            renderOrderSummary();
            renderPaymentSummary();
            updateCartQty();
        });
    });


    document.querySelectorAll('.js-input-quantity').forEach((input) => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const productId = input.dataset.productId;
                onClickSave(productId);
            }
        });
    });

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
        element.addEventListener('click', () => {
            const { productId, deliveryOptionId } = element.dataset;
            updateDeliveryOption(productId, deliveryOptionId);
            renderOrderSummary();
            renderPaymentSummary();

        });
    });

    updateCartQty();
    function updateCartQty() {
        const cartQuantity = calculateCartQuantity() || '';
        document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
        localStorage.setItem('cartQuantity', cartQuantity);
    }

    /*
    function changeDeliveryDate() {
        cart.forEach((cartItem) => {
            const productId = cartItem.productId;

            const matchingProduct = getProduct(productId);

            const deliveryOptionId = cartItem.deliveryOptionId;

            const deliveryOption = getDeliveryOption(deliveryOptionId);

            const today = dayjs();
            const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
            const dateString = deliveryDate.format('dddd, MMMM D');
            document.querySelector(`.js-change-delivery-date-${productId}`).innerHTML = dateString;
        });
    }
    */
}