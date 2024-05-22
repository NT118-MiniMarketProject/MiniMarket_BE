const prisma  = require('../config/prisma.instance')
const CustomError = require('../errors')

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
            
        }

        return {data: order};
    } catch(err) {
        throw err;
    }
}

module.exports = {
    AddService
}