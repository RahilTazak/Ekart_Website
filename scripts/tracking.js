import { getOrder } from '../data/orders.js';
import { getProduct, loadProductsFetch } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { cart, addToCart, calculateCartQuantity } from '../data/cart.js';




loadPage();
async function loadPage() {
    await loadProductsFetch();

    const url = new URL(window.location.href);
    const orderId = Number(url.searchParams.get('orderId'));
    const productId = url.searchParams.get('productId');
    const order = getOrder(orderId);
    const product = getProduct(productId);

    console.log(order);
    console.log(product);

    let productDetails;

    order.products.forEach((details) => {

        if (details.productId === product.id) {
            productDetails = details;
        }
    });
    console.log(productDetails);

    const today = dayjs();
    const orderTime = dayjs(order.orderTime);
    const deliveryTime = dayjs(productDetails.estimatedDeliveryDate);
    const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
    console.log(today);
    console.log(orderTime.format('D'));
    console.log(deliveryTime.format('D'));
    console.log(percentProgress);
    console.log(today - orderTime);
    console.log(deliveryTime.format('D') - orderTime.format('D'));

    const deliveryMessage = today < deliveryTime ? 'Arriving on ' : 'Delivered on ';

    const trackingHTML = `
        <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
        </a>

        <div class="delivery-date">
            ${deliveryMessage}
            ${deliveryTime.format('dddd, MMM D')}
        </div>

        <div class="product-info">
            ${product.name}
        </div>

        <div class="product-info">
            ${productDetails.quantity}
        </div>

        <img class="product-image" src="${product.image}">

        <div class="progress-labels-container">
            <div class="progress-label">
            Preparing
            </div>
            <div class="progress-label current-status">
            Shipped
            </div>
            <div class="progress-label">
            Delivered
            </div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-bar js-progress-bar" style="width: ${percentProgress}%;"></div>
        </div>
    `;

    document.querySelector('.js-order-tracking').innerHTML = trackingHTML;

    updateCartQty();
    function updateCartQty() {
        const cartQuantity = calculateCartQuantity() || '';
        document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
    }
}

