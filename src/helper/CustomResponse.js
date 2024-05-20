const UserResponse = () => {
    return  select = {
        name: true, 
        email: true,
        phone: true,
        address: true,
        avater: true,
        role: true
    }
}

const CartResponse = () => {
    let cartItemResponse = CartItemResponse();
    return select = {
        cart_id: true,
        quantity: true,
        total: true,
        saved: true,
        cartItems: {
            select: cartItemResponse
        }
    }
}

const CartItemResponse = () => {
    const ProductResponse = ProductCartItemResponse();
    return select = {
        quantity: true,
        total: true,
        saving: true,
        products: {
            select: ProductResponse
        }
    }
}

const ProductCartItemResponse = () => {
    return select = {
        product_id: true,
        thumbnail: true,
        name: true,
        reg_price: true,
        discount_price: true,
    }
}

module.exports = {
    UserResponse,
    CartResponse, 
    CartItemResponse
}