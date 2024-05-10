const {StatusCodes} = require('http-status-codes')
const ProductService = require('../services/product.service')

//PRODUCTS
const GetAllProducts = async (req, res, next) => {
    try {
        const query = req.query
        const {products, numOfPages, totalProducts, currentPage } = await ProductService.GetProductsService(query);
        res.status(StatusCodes.OK).json({numOfPages, totalProducts, currentPage, products});
    } catch (err) {
        next(err)
    }
}

const GetPopularProducts = async (req, res, next) => {
    try {
        const {data} = await ProductService.GetPopularProductsService();
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err)
    }
}

const GetDetailOfProducts = async (req, res, next) => {
    try {
        const {id: productId} = req.params;
        const {data} = await ProductService.GetDetailOfProductService({productId});
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err)
    }
}

const GetReleventProduct = async (req, res, next) => {
    try {
        const {id: productId} = req.params;
        const {data} = await ProductService.GetReleventProductService({productId});
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err)
    }
}

//WISHLIST
const addWishList = async (req, res, next) => {
    try {
        const {product_id} = req.body
        const user = req.user 
        const {list} = await ProductService.addToWishList({product_id, user})
        res.status(StatusCodes.OK).json({Wishlist: list})
    }
    catch (err) {
        next(err)
    }
}

const removeWishList = async (req, res, next) => {
    try {
        const {product_id} = req.body
        const user = req.user 
        const {list} = await ProductService.removeFromWishList({product_id, user})
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

module.exports = {
    addWishList,
    removeWishList,
    getProductsInWishList,
    GetAllProducts,
    GetPopularProducts,
    GetDetailOfProducts,
    GetReleventProduct
}