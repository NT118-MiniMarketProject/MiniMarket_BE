const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const OrderService = require('../services/order.service')

const CreateOrder = async(req, res, next) => {
    try {
        const data = await OrderService.AddService({body: req.body, userId: req.user.userId});
        res.status(StatusCodes.OK).json({data})
    } catch (err) {
        next(err);
    }
}

const OrderList = async(req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
}

const DetailOrder = async(req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
}

module.exports = {
    CreateOrder,
    OrderList,
    DetailOrder
}