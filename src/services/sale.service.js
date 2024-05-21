const prisma = require('../config/prisma.instance')
const productService = require('../services/product.service')
const CustomError = require('../errors')

// Get all sale events
const GetSalesService = async () => {
    try {
        const getList = await prisma.saleEvent.findMany({
            where: {
                is_visible: 1
            }
        })
        const list = getList.map(({ is_visible, ...rest }) => rest)
        return {saleEvents: list}
    } catch (err) {
        throw err
    }
}

// Get sale items of specified sale event
const GetSaleItemsService = async (saleEventId) => {
    try {
        const getValues = await prisma.saleItem.findMany({
            where: {
                saleEventId: Number(saleEventId)
            },
            select: {
                products: true,
                quantity: true,
                remain: true
            }
        })
        const list = getValues.map(item => {
            const tmp = {
                product_id: item.products.product_id,
                name: item.products.name,
                thumbnail: item.products.thumbnail,
                reg_price: item.products.reg_price,
                discount_percent: item.products.discount_percent,
                discount_price: item.products.discount_price,
                rating: item.products.rating,
                quantity: item.quantity,
                remain: item.remain
            };
            return tmp;
        });
        return {saleItems: list}
    } catch (err) {
        throw err
    }
}

module.exports = {
    GetSalesService,
    GetSaleItemsService
}