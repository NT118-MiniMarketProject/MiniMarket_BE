const {StatusCodes} = require('http-status-codes')
const ProductService = require('../services/product.service')
const utils = require('../utils')

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

const CreateProduct = async (req, res, next) => {
    try {
        const body = req.body;
        const file = req.files ? req.files.image.tempFilePath : null;
        const {data} = await ProductService.CreateBodyService({body, file})
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err)
    }   
}

const UploadImageForProduct = async (req, res, next) => {
    try {
        const file = req.files ? req.files.image.tempFilePath : null;
        const data = await utils.uploadImage(req.params.id, file, 2);
        res.status(StatusCodes.OK).json({data});
    } catch (err) {
        next(err);
    }
}

const UpdateProduct = async (req, res, next) => {
    try {
        const body = req.body;
        console.log(req.params.id)
        const {data} = await ProductService.UpdateProductService(body, req.params.id);
        res.status(StatusCodes.OK).json({data});
    } catch(err) {
        next(err);
    }
}

const DeleteProduct = async (req, res, next) => {
    try {
        const body = req.body;
        console.log(req.params.id)
        const data = await ProductService.DeleteProductService(req.params.id);
        res.status(StatusCodes.OK).json({msg: 'Product deleted successfully', data});
    } catch(err) {
        next(err);
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
    GetReleventProduct,
    CreateProduct,
    UploadImageForProduct,
    UpdateProduct,
    DeleteProduct
}