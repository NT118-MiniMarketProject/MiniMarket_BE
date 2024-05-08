const brandService = require('../services/brand.service')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')

const GetBrandByCategoryGroup = async (req, res, next) => {
    try {
        const categroupId = parseInt(req.params.id, 10); 
        const {brandList} = await brandService.GetBrandByCategoryGroupService({categroupId})
        res.status(StatusCodes.OK).json({brandList: brandList})
    } catch (err) {
        next(err)
    }
}

const GetBrandByCategory = async(req, res, next) => {
    try {
        const categoryId = req.params.id;
        const {brandList} = await brandService.GetBrandByCategoryService({categoryId: categoryId})
        res.status(StatusCodes.OK).json({brandList: brandList})
    } catch (err) {
        next(err)
    }
}

module.exports = {
    GetBrandByCategory,
    GetBrandByCategoryGroup
}