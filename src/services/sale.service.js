const prisma = require('../config/prisma.instance')
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
        return {saleList: list}
    } catch (err) {
        throw err
    }
}
module.exports = {
    GetSalesService
}