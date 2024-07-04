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

// Add a new sale event
const AddSaleEvent = async ({name, description, startTime, endTime, is_visible}) => {
    try {
        const checkExist = await prisma.saleEvent.findFirst({
            where: {
                nameEvent: name
            }
        })
        if (checkExist) {
            throw new CustomError.BadRequestError('Sale event name already exists')
        }
        if (new Date(endTime) <= new Date(startTime)) {
            throw new CustomError.BadRequestError('End time must be greater than start time');
        }
        const saleEvent = await prisma.saleEvent.create({
            data: {
              nameEvent: name,
              description,
              startTime: new Date(startTime),
              endTime: new Date(endTime),
              is_visible,
            },
        });
        return {saleEvent: saleEvent}
    }
    catch (err) {
        throw err
    }
}

// Delete a sale event
const DeleteSaleEvent = async (name) => {
    try {
        const checkExist = await prisma.saleEvent.findFirst({
            where: {
                nameEvent: name
            }
        })
        if (!checkExist) {
            throw new CustomError.BadRequestError('Sale event name not exist')
        }
        await prisma.saleEvent.deleteMany({
            where: {
                nameEvent: name
            }
        });
        return {msg: 'Sale event deleted'}
    }
    catch (err)
    {
        throw err
    }
} 

// Quarter statistics
const QuarterStatistics = async ({quarter, year}) => {
    try {
        const startMonth = (quarter - 1) * 3 + 1;
        const endMonth = startMonth + 2;
        const startDate = new Date(year, startMonth - 1, 1);
        const endDate = new Date(year, endMonth, 0);
        
        const totalOrders = await prisma.order.count({
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        if (totalOrders <= 0)
        {
            throw new CustomError.BadRequestError('No order in this quarter')
        }
        
        const totalOrderRevenue = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                created_at: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })

        const popularProduct = await prisma.orderItem.groupBy({
            by: ['product'],
            _sum: {
                quantity: true
            },
            orderBy: {
                _sum: {
                  quantity: 'desc',
                },
            },
            take: 1,
            where: {
                order: {
                    created_at: {
                        gte: startDate,
                        lte: endDate
                    }
                }
            }
        })
        const prod = await prisma.product.findUnique({
            where: {
              product_id: popularProduct[0].product,
            },
        });
        const stats = {
            totalOrders: totalOrders,
            totalRevenue: totalOrderRevenue['_sum']['total'],
            popularProductBoughtTimes: popularProduct[0]['_sum']['quantity'],
            popularProduct: prod
        }
        return {stats: stats}
    }
    catch (err)
    {
        throw err
    }
}

module.exports = {
    GetSalesService,
    GetSaleItemsService,
    AddSaleEvent,
    DeleteSaleEvent,
    QuarterStatistics
}