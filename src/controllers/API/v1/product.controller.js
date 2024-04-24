const {StatusCodes} = require('http-status-codes')
const ProductService = require('../../../services/API/v1/product.service')

const GetAllProducts = async (req, res, next) => {
    try {
        const query = req.query
        const {} = null
    } catch (err) {
        next(err)
    }
}