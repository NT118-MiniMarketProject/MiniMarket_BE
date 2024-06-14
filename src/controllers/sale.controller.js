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

const addSaleEvent = async (req, res, next) => {
    try {
        const {saleEvent} = await SaleService.AddSaleEvent(req.body)
        res.status(StatusCodes.OK).json({saleEvent: saleEvent})
    }
    catch (err) {
        next(err)
    }
}

const deleteSaleEvent = async (req, res, next) => {
    try {
        console.log(req.body)
        const msg = await SaleService.DeleteSaleEvent(req.body.name)
        res.status(StatusCodes.OK).json(msg)
    }
    catch (err) {
        next(err)
    }
}

const quarterStats = async (req, res, next) => {
    try {
        const {stats} = await SaleService.QuarterStatistics(req.body)
        res.status(StatusCodes.OK).json({stats: stats})
    }
    catch (err) {
        next(err)
    }
}
module.exports = {
    getSales,
    getSaleItems,
    addSaleEvent,
    deleteSaleEvent,
    quarterStats
}