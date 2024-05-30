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
        const {data} = await OrderService.GetService({userId: req.user.userId});
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err);
    }
}

const DetailOrder = async(req, res, next) => {
    try {
        const {data} = await OrderService.GetDetailOfOrder({orderId: req.params.id});
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err);
    }
}

const UpdateOrder = async(req, res, next) => {
    try {
        const {data} = await OrderService.UpdateService({orderId: req.params.id, body: req.body});
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err);
    }
}

const CancelOrder = async(req, res, next) => {
    try {
        const {msg} = await OrderService.CancelOrderService({orderId: req.params.id});
        res.status(StatusCodes.OK).json({msg});
    } catch (err) {
        next(err);
    }
}

module.exports = {
    CreateOrder,
    OrderList,
    DetailOrder,
    UpdateOrder,
    CancelOrder
}