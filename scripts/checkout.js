
import { renderOrderSummary } from './checkout/orderSummary.js';
import { totalCents, renderPaymentSummary, ordersClass } from './checkout/paymentSummary.js';
import { loadProductsFetch } from '../data/products.js';
//import '../data/cart-class.js';
import { cart } from '../data/cart.js';
import { orders } from '../data/orders.js';


async function loadPage() {
    try {
        await loadProductsFetch();

        renderOrderSummary();
        renderPaymentSummary();
        console.log(totalCents);
    } catch(error) {
        console.log('Unexpected error. try again later.')
    }
}

loadPage().then(() => {
    console.log(ordersClass);
    console.log(cart);
    console.log(orders);

});


/*
loadProductsFetch().then(() => {
    renderOrderSummary();
    renderPaymentSummary();
});
*/



