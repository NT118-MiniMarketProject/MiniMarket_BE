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

const OrderResponse = () => {
    let orderItemResponse = OrderItemResponse();
    return select = {
        order_id: true,
        address: true,
        total: true,
        note: true,
        status: true,
        payment_method: true,
        orderitems: {
            select: orderItemResponse
        }
    }
}

const OrderItemResponse = () => {
    const ProductResponse = ProductCartItemResponse();
    return select = {
        orderitem_id: true,
        price: true,
        quantity: true,
        total: true,
        fromEvent: true,
        products: {
            select: ProductResponse
        }
    }
}

module.exports = {
    UserResponse,
    CartResponse, 
    CartItemResponse,
    OrderResponse
}