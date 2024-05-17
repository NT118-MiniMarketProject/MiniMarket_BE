const prisma = require('../config/prisma.instance');
const CustomError = require('../errors')
const ProductService = require('./product.service')

const GetAllReviewService = async({product_id}) => {
    try {
        const {product} = await ProductService.GetProductByIdService({product_id});
        if(!product) 
            throw new CustomError.NotFoundError('Product not found');

        const data = await prisma.reviews.findMany({
            where: {
                productId: product_id
            }
        })

        return {data}
    } catch (err) {
       throw err;
    }
}

const CreateReviewForProductService = async({userId, product_id, body}) => {
    try {
        const {product} = await ProductService.GetProductByIdService({product_id});
        if(!product) 
            throw new CustomError.NotFoundError('Product not found');

        const newData = {
            ...body,
            productId: product_id,
            userId: userId
        }
        const data = await prisma.reviews.create({
            data: newData
        })
        return {data}
    } catch (err) {
        throw err;
    }
}

module.exports = {
    GetAllReviewService,
    CreateReviewForProductService
}