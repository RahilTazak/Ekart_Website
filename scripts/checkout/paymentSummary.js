import { cart, calculateCartQuantity, saveToStorage } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { getDeliveryOption } from '../../data/deliveryOptions.js';
import { orders, addOrders } from '../../data/orders.js';
//import OrderClass from '../../data/order-class.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';



export let totalCents;
//export let orders = JSON.parse(localStorage.getItem('orders')) || [];
export function renderPaymentSummary() {
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((item) => {
        const product = getProduct(item.productId);
        productPriceCents += product.priceCents * item.quantity;

        const deliveryOption = getDeliveryOption(item.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;
    });

    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
    const taxCents = totalBeforeTaxCents * 0.1;
    // const totalCents = totalBeforeTaxCents + taxCents;
    totalCents = totalBeforeTaxCents + taxCents;

    const paymentSummaryHtml = `
            <div class="payment-summary-title">
                              Order Summary
                          </div>

                          <div class="payment-summary-row">
                              <div>Items (<span class="js-cart-items"></span>):</div>
                              <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
                          </div>

                          <div class="payment-summary-row">
                              <div>Shipping &amp; handling:</div>
                              <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
                          </div>

                          <div class="payment-summary-row subtotal-row">
                              <div>Total before tax:</div>
                              <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
                          </div>

                          <div class="payment-summary-row">
                              <div>Estimated tax (10%):</div>
                              <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
                          </div>

                          <div class="payment-summary-row total-row">
                              <div>Order total:</div>
                              <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
                          </div>

                          <button class="place-order-button button-primary js-place-order">
                              Place your order
                          </button>
                          `;

    document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHtml;

    document.querySelector('.js-cart-items').innerHTML = calculateCartQuantity();

    document.querySelector('.js-place-order').addEventListener('click', () => {
        try {
            /*const response = await fetch('', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cart: cart;
                })
            });
            const order = await response.json();
            */
            addOrders({
                orderTime: dayjs().format('D MMMM YYYY'),
                totalCostCents: totalCents,
                orderId: Math.floor(Math.random() * 1000000),
                products: cart
            });
            console.log(orders);
            //console.log(orders);
            const placeOrder = orders;
            //orders.forEach((orderArray) => {
            //orders.push({
            //    orderTime: dayjs().format('MMMM D'),
             //   totalCostCents: totalCents,
               // orderId: Math.floor(Math.random() * 1000000),
               // products: cart      // new OrderClass(orderArray)
           // });
           // });
            localStorage.setItem('orders', JSON.stringify(orders));
            console.log(cart);
            console.log(orders);

        } catch (error) {
            console.log('Unexpected error. try again later.')
        }
        cart.length = 0;
        saveToStorage();
        changePageText(cart);
        window.location.href = 'orders.html';
    });   
}

function changePageText(cart) {
    document.querySelector('.js-order-summary').innerHTML = cart;
    document.querySelector('.js-payment-summary').innerHTML = `
            <div class="payment-summary-title">
                              Order Summary
                          </div>

                          <div class="payment-summary-row">
                              <div>Items (<span class="js-cart-items"></span>):</div>
                              <div class="payment-summary-money">$0</div>
                          </div>

                          <div class="payment-summary-row">
                              <div>Shipping &amp; handling:</div>
                              <div class="payment-summary-money">$0</div>
                          </div>

                          <div class="payment-summary-row subtotal-row">
                              <div>Total before tax:</div>
                              <div class="payment-summary-money">$0</div>
                          </div>

                          <div class="payment-summary-row">
                              <div>Estimated tax (10%):</div>
                              <div class="payment-summary-money">$0</div>
                          </div>

                          <div class="payment-summary-row total-row">
                              <div>Order total:</div>
                              <div class="payment-summary-money">$0</div>
                          </div>

                          <button class="place-order-button button-primary js-place-order">
                              Place your order
                          </button>
                          `;
    const cartQuantity = calculateCartQuantity() || 'No items in the cart';
    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
    document.querySelector('.js-cart-quantity').innerHTML = cart.length;

}





/*function addToOrdersClass(cart, orders) {
    addOrders(cart);
    const placeOrder = orders;
    console.log(placeOrder);
    const today = dayjs().format('MMMM D');
    console.log(today);
    const ordersClass = new OrderClass(placeOrder);

    console.log(ordersClass);
}*/



