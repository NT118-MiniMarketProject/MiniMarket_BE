const {StatusCodes} = require('http-status-codes')
const ProductService = require('../../../services/API/v1/product.service')

const addWishList = async (req, res, next) => {
    try {
        const body = req.body
        
        const {list} = await ProductService.addToWishList({body, req, res})
        res.status(StatusCodes.OK).json({Wishlist: list})
    }
    catch (err) {
        next(err)
    }
}

const removeWishList = async (req, res, next) => {
    try {
        const body = req.body

        const {list} = await ProductService.removeFromWishList({body, req, res})
        res.status(StatusCodes.OK).json({Wishlist: list})
    }
    catch (err) {
        next(err)
    }
}

const GetAllProducts = async (req, res, next) => {
    try {
        const query = req.query
        const {} = null
    } catch (err) {
        next(err)
    }
}

module.exports = {
    addWishList,
    removeWishList
}