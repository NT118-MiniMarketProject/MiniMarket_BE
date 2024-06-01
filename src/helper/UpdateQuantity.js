const ProductService = require('../services/product.service')


const UpdateNewQuantityProduct = async (quantity, id) => {
    const newProductData = {
            quantity
        };
        await ProductService.UpdateProductService(newProductData, id);
}

module.exports = {
    UpdateNewQuantityProduct
}