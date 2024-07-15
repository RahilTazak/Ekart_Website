
export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}
export function addToCart(productId) {
        let matchingItem;

        cart.forEach((item) => {
            if (productId === item.productId) {
                matchingItem = item;
            }
        });

        var selectQty = Number(document.querySelector(`.js-select-quantity-${productId}`).value);

        if (matchingItem) {
            matchingItem.quantity += selectQty;
        } else {
            cart.push({
                productId: productId,
                quantity: selectQty
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
    console.log(cart);
}



