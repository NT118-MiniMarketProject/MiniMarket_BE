const prisma = require('../config/prisma.instance')
const CustomError = require('../errors')
const productService = require('../services/product.service')
const categoryService = require('../services/category.service')

const GetBrandListService = async({categoryList}) => {
    try {
        const {productList} = await productService.GetProductsByCategoryList({categoryList});

        const brandIds = [...new Set(productList.map(product => product.br_id))];

        const brandList = await prisma.brand.findMany({
            where: {
                brand_id: {
                    in: brandIds
                }
            }
        });
        return {
            brandList: brandList
        }
    } catch (err) {
        throw err
    }
}

const GetBrandByCategoryGroupService = async({categroupId}) => {
    try {

        const {categoryGroup} = await categoryService.getCategoryGroupByIdService({categorygroup: categroupId})
        if(!categoryGroup) 
            throw new CustomError.NotFoundError(`Not found category group`)

        const {categoryList} = await categoryService.getCategoryListByCategoryGroupService({categroupId});

        const {brandList} = await GetBrandListService({categoryList})

        return {
            brandList: brandList
        }
    } catch (err) {
        throw err
    }
}

const GetBrandByCategoryService = async({categoryId}) => {
    try {
        const {category} = await categoryService.getCategoryByIdService({category_id: categoryId});
        if(!category) 
            throw new CustomError.NotFoundError(`Not found category id`)
        
        const categoryList = [category]
        const {brandList} = await GetBrandListService({categoryList})

        return {
            brandList: brandList
        }
    } catch (err) {
        throw err
    }
}

const GetBrandByIdService = async({brandId}) => {
    try {
        const brand = await prisma.brand.findFirst({
            where: {
                brand_id: brandId
            }
        });
        return {brand};
    } catch (err) {
        throw err 
    }
}

module.exports = {
    GetBrandByCategoryGroupService,
    GetBrandByCategoryService,
    GetBrandByIdService
}