const ProductService = require('../services/product.service')
const prisma = require('../config/prisma.instance')

const createNewCartItem = async({quantity, product, cartId, price}) => {
    try {
        const newData = {
            quantity,
            total: quantity * price,
            cartUser: cartId,
            product: product.product_id,
            saving: quantity * (product.reg_price - price)
        };
        let cartItem = await prisma.cartItem.create({
            data: newData
        });
        const newProductData = {
            quantity: product.quantity - quantity
        };
        await ProductService.UpdateProductService(newProductData, product.product_id);

        return cartItem;
    } catch (err) {
        throw err;
    }
}

const CartItemLoop = async ({cart, select}) => {
    try {
        let totalPrice = 0;
        let totalQuantity = 0;
        let totalSaved = 0;
        for(const ele of cart.cartItems) {
           totalPrice += ele.total;
           totalQuantity += ele.quantity;
           totalSaved += ele.saving;
        }

        const newCartData = {
            quantity: totalQuantity,
            total: totalPrice,
            saved: totalSaved
        };

        const data = await prisma.cart.update({
            where: {
                cart_id: cart.cart_id
            },
            data: newCartData,
            select
        });
        return {data};
    } catch (err) {
        throw err;
    }
}

module.exports = {
    createNewCartItem,
    CartItemLoop
};