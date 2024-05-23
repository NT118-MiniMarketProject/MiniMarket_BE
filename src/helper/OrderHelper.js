const prisma = require('../config/prisma.instance')


const OrderItemLoop = async ({order, select}) => {
    try {
        let total = 0;
        for(const ele of order.orderitems) {
           total += ele.total;
        }

        const newOrderData = {
            total,
        };

        const data = await prisma.order.update({
            where: {
                order_id: order.order_id
            },
            data: newOrderData,
            select
        });
        return {data};
    } catch (err) {
        throw err;
    }
}

module.exports = {
    OrderItemLoop
}