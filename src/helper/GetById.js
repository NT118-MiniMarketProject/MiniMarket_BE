const prisma = require('../config/prisma.instance')

module.exports = {
    getCategoryGroupByIdService: async ({categorygroup}) => {
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
    },
    getCategoryListByCategoryGroupService: async({categroupId}) => {
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
    },
    getCategoryByIdService: async({category_id}) => {
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
    },
    GetBrandByIdService: async({brandId}) => {
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
}
