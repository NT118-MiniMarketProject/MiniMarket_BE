const {prisma} = require('../../../config/prisma.instance')
const CustomError = require('../../../errors')

const GetAllService = async() => {
    try {
        const categories = await prisma.category.findMany({})
        return {categories: categories}
    } catch (err) {
        throw err
    }
}

const getCategoryByIdService = async({category_id}) => {
    try {
        const category = await prisma.category.findFirst({
            where: {
                categroup: category_id
            }
        })
        return {category: category}
    } catch (err) {
        throw err
    }
}

const getCategoryGroupByIdService = async ({categorygroup}) => {
    try {
        // console.log(1)
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

const createCategorService = async({body}) => {
    try {
        
        const {category_name, thumbnail_category, categroup} = body

        const {NameExist} = await getNameCategoryService({name: category_name})

        if(NameExist) 
            throw new CustomError.BadRequestError(`Name already exists`)

        const category = await prisma.category.create({
            data: {
                category_name,
                thumbnail_category,
                categroup
            }
        })
        return {category: category}
    } catch (err) {
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

module.exports = {
    GetAllService, 
    getCategoryByIdService,
    createCategorService, 
    getCategoryGroupByIdService,
    createCategorGroupService,
    getNameCategoryService,
    getNameGroupService,
    createCategorGroupService
}