const categoryService = require('../services/category.service')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const utils = require('../utils')
const getById = require('../helper/GetById')

const GetAllCategory = async (req, res, next) => {
    try {
        const {categories} = await categoryService.GetAllCategoryService()
        res.status(StatusCodes.OK).json({categories})
    } catch (err) {
        next(err)
    }
}

const CreateCategory = async (req, res, next) => {
    try {
        
        const body = req.body
        body.categroup = parseInt(body.categroup, 10);
        const file = req.files ? req.files.image.tempFilePath : null;
        const {categoryGroup} = await getById.getCategoryGroupByIdService({categorygroup: body.categroup})

        if(!categoryGroup) {
            throw new CustomError.BadRequestError(`Invalid category group`)
        }

        const {category} = await categoryService.createCategorService({body, file})
        res.status(StatusCodes.OK).json({category})
    } catch (err) {
        next(err)
    }
}

const CreateCategoryGroup = async (req, res, next) => {
    try {
        
        const body = req.body
        const {NewCategoryGroup} = await categoryService.createCategorGroupService({body})
        res.status(StatusCodes.OK).json({NewCategoryGroup})
    } catch (err) {
        next(err)
    }
}

const GetAllCategoryGroups = async (req, res, next) => {
    try {
        const {categroup} = await categoryService.GetAllCateGroupService();
        res.status(StatusCodes.OK).json({categroup});
    } catch (err) {
        next(err)
    }
}

const GetCategoryByCategoryGroupAll = async (req, res, next) => {
    try {
        const {categoryByGroup} = await categoryService.CategoryByCateGroupService({categroupId:null});
        res.status(StatusCodes.OK).json({categoryByGroup});
    } catch (err) {
        next(err)
    }
}

const GetCategoryGroupById = async (req, res, next) => {
    try {
        const categroupId = parseInt(req.params.id, 10);
        const {categoryByGroup} = await categoryService.CategoryByCateGroupService({categroupId});
        res.status(StatusCodes.OK).json({categoryByGroup});
    } catch (err) {
        next(err)
    }
}

const GetProductByCategoryGroup = async (req, res, next) => {
    try {
        const categroupId = parseInt(req.params.id, 10);
        const query = req.query
        const {products, numOfPages, totalProducts, currentPage } = await categoryService.getProductByCategoryGroupService({categroupId, query})
        // const {result} = await categoryService.getProductByCategoryGroupService({categroupId, query})
        res.status(StatusCodes.OK).json({numOfPages, totalProducts, currentPage, products});
    } catch (err) {
        next(err)
    }
}

const UploadImageForCategory = async (req, res, next) => {
    try {
        const file = req.files ? req.files.image.tempFilePath : null;
        const category = await utils.uploadImage(req.params.id, file, 3);
        res.status(StatusCodes.OK).json({category})
    } catch (err) {
        console.log(err)
        next(err)
    }
}

module.exports = {
    GetAllCategory,
    CreateCategory,
    CreateCategoryGroup,
    GetAllCategoryGroups,
    GetCategoryByCategoryGroupAll,
    GetCategoryGroupById,
    GetProductByCategoryGroup,
    UploadImageForCategory
}