const {StatusCodes} = require('http-status-codes')
const SaleService = require('../services/sale.service')

const getSales = async (req, res, next) => {
    try {
        const {saleList} = await SaleService.GetSalesService()
        res.status(StatusCodes.OK).json({sales: saleList})
    }
    catch (err) {
        next(err)
    }
}
module.exports = {
    getSales
}