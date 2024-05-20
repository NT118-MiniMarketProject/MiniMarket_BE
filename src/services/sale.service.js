const prisma = require('../config/prisma.instance')
const CustomError = require('../errors')

// Get all sale events
const GetSalesService = async () => {
    try {
        const getList = await prisma.saleEvent.findMany({
            where: {
                is_visible: 1
            },
            select: {
                saleEventId: true,
                nameEvent: true,
                description: true,
                startTime: true,
                endTime: true
            }
        })
        return {saleList: getList}
    } catch (err) {
        throw err
    }
}
module.exports = {
    GetSalesService
}