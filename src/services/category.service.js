const prisma = require('../config/prisma.instance')
const CustomError = require('../errors')
const helper = require('../helper')
const productService = require('./product.service')
const utils = require('../utils')


const GetAllCategoryService = async() => {
    try {
        const categories = await prisma.category.findMany()
        return {categories: categories}
    } catch (err) {
        throw err
    }
}

const getCategoryByIdService = async({category_id}) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                category_id: category_id
            }
        })
        return {category: category}
    } catch (err) {
        throw err
    }
}

const getCategoryGroupByIdService = async ({categorygroup}) => {
    try {
        const CategoryGroup = await prisma.category_Group.findUnique({
            where: {
                categroup_id: categorygroup
            }
        })
        return {categoryGroup: CategoryGroup}
    } catch (err) {
        throw err
    }
}

const getCategoryListByCategoryGroupService = async({categroupId}) => {
    try {
        const categoryList = await prisma.category.findMany({
            where: {
                category_group: {
                    categroup_id: categroupId
                }
            }
        });
        return {categoryList: categoryList};
    } catch (err) {
        throw err
    }
}

const getNameCategoryService = async ({name}) => {
    try {
        const NameExist = await prisma.category.findFirst({
            where: {
                category_name: name
            }
        })
        return {NameExist: NameExist}
    } catch (err) {
        throw err
    }
}

const getNameGroupService = async ({name}) => {
    try {
        const NameExist = await prisma.category_Group.findFirst({
            where: {
                categroup_name: name
            }
        })
        return {NameExist: NameExist}
    } catch (err) {
        throw err
    }
}

const createCategorService = async({body, file = null}) => {
    try {
        
        const {category_name, categroup} = body

        let thumbnail_category

        const {NameExist} = await getNameCategoryService({name: category_name})

        if(NameExist) 
            throw new CustomError.BadRequestError(`Name already exists`);

        if(file){
            thumbnail_category = await utils.uploadImageConfig(file);
        }

        const category = await prisma.category.create({
            data: {
                category_name,
                thumbnail_category,
                categroup
            }
        })
        return {category: category}
    } catch (err) {
        console.log(err)
        throw err
    }
}

const createCategorGroupService = async({body}) => {
    try {

        const {NameExist} = await getNameGroupService({name: body.categroup_name})

        if(NameExist) 
            throw new CustomError.BadRequestError(`Name already exists`)

        const NewCategoryGroup = await prisma.category_Group.create({
            data: {
                categroup_name: body.categroup_name,
                thumbnail: body.thumbnail ? body.thumbnail : null
            }
        })
        return {NewCategoryGroup: NewCategoryGroup}
    } catch (err) {
        throw err
    }
}

const GetAllCateGroupService = async() => {
    try {
        const categroup = await prisma.category_Group.findMany();
        return {categroup: categroup}
    } catch (err) {
        throw err
    }
}

const CategoryByCateGroupService = async({ categroupId }) => {
    try {
        let categoryByGroup;
        if(categroupId) {
            const {categoryGroup} = await getCategoryGroupByIdService({categorygroup: categroupId});

            if(!categoryGroup) 
                throw new CustomError.NotFoundError(`Not found category group`);

            categoryByGroup = await prisma.category_Group.findMany({
                where: {
                    categroup_id: categroupId
                },
                include: {
                    categories: true
                }
            });
        } else {
            categoryByGroup = await prisma.category_Group.findMany({
                include: {
                    categories: {
                        take: 10
                    }
                }
            });
        }
        const modifiedCategoryByGroup = helper.modifyCategoryByGroup(categoryByGroup);
        return { categoryByGroup: modifiedCategoryByGroup };
    } catch (err) {
        throw err
    }
}

const getProductByCategoryGroupService = async({categroupId, query}) => {
    try {
        const {categoryGroup} = await getCategoryGroupByIdService({categorygroup: categroupId});

        if(!categoryGroup) 
            throw new CustomError.NotFoundError(`Not found category group`);

        query.categoryGroupId = categroupId;
        
        const {products, numOfPages, totalProducts, currentPage} = await productService.GetProductsService(query);

        return {products, numOfPages, totalProducts, currentPage}

    } catch (err) {
        throw err
    }
}

module.exports = {
    GetAllCategoryService, 
    createCategorService, 
    getCategoryGroupByIdService,
    getCategoryByIdService,
    createCategorGroupService,
    GetAllCateGroupService,
    CategoryByCateGroupService,
    getCategoryListByCategoryGroupService,
    getProductByCategoryGroupService
}