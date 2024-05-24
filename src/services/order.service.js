const prisma  = require('../config/prisma.instance')
const CustomError = require('../errors')
const CartService = require('./cart.service')
const ProductService = require('./product.service')
const helper = require('../helper')

const AddService = async({body, userId}) => {
    try {

        const {address, note} = body

        const cart = await prisma.cart.findFirst({
            where: {
                user_id: userId
            },
            include: {
                cartItems: true
            }
        })
        if(cart.cartItems.length == 0) 
            throw new CustomError.NotEnoughError(`Khong tim thay san pham nao trong gio hang`);

        const order = await prisma.order.create({
            data: {
                user_id: userId,
                address: address,
                note: note ? note : null
            }
        });

        for (const ele of cart.cartItems) {
            const check = await CartService.CheckSaleItems(ele.product);
            const {product} = await ProductService.GetProductByIdService({product_id: ele.product});
            const data = {
                price: product.event_price ? product.event_price : product.discount_price,
                quantity: ele.quantity,
                total: ele.total,
                order_id: order.order_id,
                product: ele.product,
                fromEvent: (check) ? 1 : 0

            }
            await prisma.orderItem.create({
                data
            });

            await CartService.DeleteService({cartItemId: ele.cartItem});
        }


        const select = helper.CustomResponse.OrderResponse();

        let { data: NewOrder } = await GetDetailOfOrder({ orderId: order.order_id });
        
        const {data} = await helper.OrderHelper.OrderItemLoop({order: NewOrder, select});

        await prisma.cart.delete({
            where: {
                cart_id: cart.cart_id
            }
        });

        return {data}
    } catch(err) {
        console.log(err);
        throw err;
    }
}

const GetService = async({userId}) => {
    try {
        const select = helper.CustomResponse.OrderResponse();
        const data = await prisma.order.findMany({
            where: {
                user_id: userId
            },
            select
        });
        return {data};
    } catch (err) {
        throw err;
    }
}

const UpdateService = async({orderId, body}) => {
    try {
        const {status, payment_method} = body;
        const Newdata = {
            status,
            payment_method
        };
        const data = await prisma.order.update({
            where: {
                order_id: orderId
            },
            data: Newdata
        });

        return {data};
    } catch (err) {
        throw err;
    }
}

const GetDetailOfOrder = async({orderId}) => {
    try {
        const select = helper.CustomResponse.OrderResponse();
        const data = await prisma.order.findFirst({
            where: {
                order_id: orderId
            },
            select
        });
        return {data};
    } catch(err) {
        throw err;
    }
}

module.exports = {
    AddService, 
    GetService,
    GetDetailOfOrder,
    UpdateService
}