const {StatusCodes} = require('http-status-codes')
const SaleService = require('../services/sale.service')

const getSales = async (req, res, next) => {
    try {
        const {saleEvents} = await SaleService.GetSalesService()
        res.status(StatusCodes.OK).json({sales: saleEvents})
    }
    catch (err) {
        next(err)
    }
}

const getSaleItems = async (req, res, next) => {
    try {
        const {saleItems} = await SaleService.GetSaleItemsService(req.params.eventId)
        res.status(StatusCodes.OK).json({saleItems: saleItems})
    }
    catch (err) {
        next(err)
    }
}
module.exports = {
    getSales,
    getSaleItems
}