const categoryService = require('../services/category.service')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')

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

        // console.log(body.categroup)

        const {categoryGroup} = await categoryService.getCategoryGroupByIdService({categorygroup: body.categroup})

        if(!categoryGroup) {
            throw new CustomError.BadRequestError(`Invalid category group`)
        }

        const {category} = await categoryService.createCategorService({body})
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
        const {categoryByGroup} = await categoryService.CategoryByCateGroupService();
        res.status(StatusCodes.OK).json({categoryByGroup});
    } catch (err) {
        next(err)
    }
}

const GetCategoryGroupById = async (req, res, next) => {
    try {
        const categroupId = parseInt(req.params.id, 10);
        const {categoryByGroup} = await categoryService.GetCategoryGroupByIdService({categroupId});
        res.status(StatusCodes.OK).json({categoryByGroup});
    } catch (err) {
        next(err)
    }
}

module.exports = {
    GetAllCategory,
    CreateCategory,
    CreateCategoryGroup,
    GetAllCategoryGroups,
    GetCategoryByCategoryGroupAll,
    GetCategoryGroupById
}