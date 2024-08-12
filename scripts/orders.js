import { getProduct, loadProductsFetch } from '../data/products.js';
import { orders } from '../data/orders.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import formatCurrency from './utils/money.js';
// import { cartQuantity } from '../scripts/checkout/orderSummary.js';
// import { calculateCartQuantity } from '../data/cart.js';
import { cart, addToCart, calculateCartQuantity } from '../data/cart.js';
import { ordersClass } from '../scripts/checkout/paymentSummary.js';
// import OrderClass from '../data/order-class.js';

console.log(ordersClass);
console.log(orders);
console.log(cart);

renderOrders();
async function renderOrders() {

    await loadProductsFetch();

    let ordersHTML = '';

    ordersClass.forEach((order) => {
        const orderTimeString = order.orderTime;

        ordersHTML += `
         <div class="order-container">
          <div class="order-header">
           <div class="order-header-left-section">
            <div class="order-date">
             <div class="order-header-label">Order Placed:</div>
              <div>${orderTimeString}</div>
             </div>
             <div class="order-total">
              <div class="order-header-label">Total:</div>
               <div>${order.totalCostCents}</div>
             </div>
           </div>

           <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
             <div>${order.orderId}</div>
            </div>
           </div>

          <div class="order-details-grid">${loadProducts(order)}
          </div>
         </div>`;
    });

        function loadProducts(order) {
            let productListHTML = '';
            order.products.forEach((productDetails) => {
            const product = getProduct(productDetails.productId);
            console.log(product);

                productListHTML +=
                    `<div class="product-image-container">
                        <img src="${product.image}">
                        </div>

                        <div class="product-details">
                        <div class="product-name">
                            ${product.name}
                        </div>
                        <div class="product-delivery-date">
                            Arriving on: ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}
                        </div>
                        <div class="product-quantity">
                            ${productDetails.quantity}
                        </div>

                        <button class="buy-again-button button-primary js-buy-again"
                          data-product-id = "${product.id}">
                            <img class="buy-again-icon" src="images/icons/buy-again.png">
                            <span class="buy-again-message">Buy it again</span>
                        </button>
                        </div>

                        <div class="product-actions">
                        <a href="tracking.html?orderId=27cba69d-4c3d-4098-b42d-ac7fa62b7664&productId=${product.id}">
                        <button class="track-package-button button-secondary">
                            Track package
                        </button>
                        </a>
                        </div>`;

            });
            return productListHTML;
    }
    document.querySelector('.js-orders-grid').innerHTML = ordersHTML;

    document.querySelectorAll('.js-buy-again').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            addToCartAgain(productId);

            // (Optional) display a message that the product was added,
            // then change it back after a second.
            button.innerHTML = 'Added';
            setTimeout(() => {
                button.innerHTML = `
                 <img class="buy-again-icon" src="images/icons/buy-again.png">
                 <span class="buy-again-message">Buy it again</span>
                 `;
             }, 1000);
        });
    });
}

updateCartQty();
function updateCartQty() {
    const cartQuantity = calculateCartQuantity() || '';
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    localStorage.setItem('cartQuantity', cartQuantity);
}

function addToCartAgain(productId) {
    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    //let selectQty = Number(document.querySelector(`.js-select-quantity-${productId}`).value) || 1;

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
            deliveryOptionId: '1'
        })
    }
    localStorage.setItem('cart', JSON.stringify(cart));

}