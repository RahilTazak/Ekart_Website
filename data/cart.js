export let cart;

loadFromStorage();

export function loadFromStorage() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
}
export function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
export function addToCart(productId) {
        let matchingItem;

        cart.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });

        let selectQty = Number(document.querySelector(`.js-select-quantity-${productId}`).value) || 1;

        if (matchingItem) {
            matchingItem.quantity += selectQty;
        } else {
            cart.push({
                productId: productId,
                quantity: selectQty,
                deliveryOptionId: '1'
            })
    }
    saveToStorage();
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
    saveToStorage();
}




