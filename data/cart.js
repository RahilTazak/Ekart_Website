import { getDeliveryOption } from "./deliveryOptions.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';



export let cart;

loadFromStorage();

export function loadFromStorage() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
}
export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const addedMessageTimeouts = {};

export function addToCart(productId) {

    const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
    addedMessage.classList.add('added-to-cart-visible');

    // Check if there's a previous timeout for this product. If there is, we should stop it.
    const previousTimeoutId = addedMessageTimeouts[productId];
    if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
    }

    const timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
    }, 2000);

    // Save the timeoutId for this product
    // so we can stop it later if we need to.
    addedMessageTimeouts[productId] = timeoutId;


    let deliveryOptionId = '1';
    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });

    let selectQty = Number(document.querySelector(`.js-select-quantity-${productId}`).value) || 1;

    let dateString = updateDeliveryDays(deliveryOptionId);

    if (matchingItem) {
        matchingItem.quantity += selectQty;
    } else {
        cart.push({
            productId: productId,
            quantity: selectQty,
            deliveryOptionId: '1',
            estimatedDeliveryDate: dateString
        })
    }
    saveToStorage();
}

export function isWeekend(date) {
    const dayOfWeek = date.format('dddd');
    return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
}

export function updateDeliveryDays(deliveryOptionId) {

    let deliveryOption = getDeliveryOption(deliveryOptionId);
    let remainingDays = deliveryOption.deliveryDays;
    let deliveryDate = dayjs();

    while (remainingDays > 0) {
        deliveryDate = deliveryDate.add(1, 'days');

        if (!isWeekend(deliveryDate)) {
            remainingDays--;
        }
    }
    const dateString = deliveryDate;
    return dateString;
}

export function removeFromCart(productId) {
    const newCart = [];
    cart.forEach((cartItem) => {
        if (productId !== cartItem.productId) {
            newCart.push(cartItem);
        }
    });
    cart = newCart;
    saveToStorage();
}

export function calculateCartQuantity() {

    let cartQuantity = 0;
    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });
    return cartQuantity;
}

export function updateQuantity(productId, newQty) {

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            cartItem.quantity = newQty;
        }
    });
    saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });
    matchingItem.deliveryOptionId = deliveryOptionId;
    let updatedDeliveryDate = updateDeliveryDays(deliveryOptionId);
    matchingItem.estimatedDeliveryDate = updatedDeliveryDate;
    saveToStorage();
    console.log(updatedDeliveryDate);
}




