const {StatusCodes} = require('http-status-codes')
const ProductService = require('../services/product.service')

const addWishList = async (req, res, next) => {
    try {
        const body = req.body
        const user = req.user 
        const {list} = await ProductService.addToWishList({body, user})
        res.status(StatusCodes.OK).json({Wishlist: list})
    }
    catch (err) {
        next(err)
    }
}

const removeWishList = async (req, res, next) => {
    try {
        const body = req.body
        const user = req.user
        const {list} = await ProductService.removeFromWishList({body, user})
        res.status(StatusCodes.OK).json({Wishlist: list})
    }
    catch (err) {
        next(err)
    }
}

const getProductsInWishList = async (req, res, next) => {
    try {
        const user = req.user
        const {list} = await ProductService.retrieveFromWishList(user.userId)
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
    removeWishList,
    getProductsInWishList
}