const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const CartService = require('../services/cart.service')

const AddToCart = async(req, res, next) => {
    try { 
        const {data} = await CartService.AddService({body: req.body, userId: req.user.userId})
        res.status(StatusCodes.OK).json({data})
    } catch (err) {
        next(err);
    }
}

const GetCartByUser = async(req, res, next) => {
    try {
        const {data} = await CartService.GetService({userId: req.user.userId});
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err);
    }
}

const UpdateCart = async(req, res, next) => {
    try {
        const cartItemId = parseInt(req.params.id)
        const {data} = await CartService.UpdateQuantityService({userId: req.user.userId, cartItemId, quantity: req.body.quantity});
        res.status(StatusCodes.OK).json({data});
    } catch(err) {
        next(err);
    }
}

module.exports = {
    AddToCart,
    GetCartByUser,
    UpdateCart
}