const prisma = require('../config/prisma.instance');
const CustomError = require('../errors')


//Common
const GetProductById = async({product_id}) => {
    try {
        const product = await prisma.product.findUnique({
            where: {
                product_id: product_id
            }
        })
        return {product: product}
    } catch (err) {
        throw err
    }
}


//search 
const GetProductsService = async(query) => {
    try {
        //query
        const where = {};
        if(query.search) {
            where.name = {
                contains: query.search,
                mode: 'insensitive'
            };
        }
        if(query.cid) {
            where.c_id = query.cid;
        } 
        if(query.brid) {
            where.br_id = query.brid;
        }
        if(query.keyword) {
            where.OR = [
                {
                    discount_percent: {
                        not: 0
                    }
                },
                {
                    event_price: {
                        not: null
                    }
                }
            ]
        }
        if(query.categoryGroupId) {
            where.category= {
                category_group: {
                    categroup_id: query.categoryGroupId
                }
            }
        }

        //sort
        let orderBy = {}
        if(query.sort === 'minTomax') {
            orderBy = {
                reg_price: 'asc'
            };
        } else if (query.sort === 'a-z') {
            orderBy = {
                name: 'asc'
            };
        } else if(query.sort === 'z-a') {
            orderBy = {
                name: 'desc'
            };
        } else if(query.sort === 'maxTomin') {
            orderBy = {
                reg_price: 'desc'
            };
        }

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;

        // console.log(where)

        // console.log(orderBy)

        const products = await prisma.product.findMany({
            where,
            orderBy,
            take: limit,
            skip
        });

        const totalProducts = await prisma.product.count({
            where
        });

        return { products, numOfPages: Math.ceil(totalProducts / limit), totalProducts, currentPage: page }
    } catch (err) {
        console.log(err);
        throw err;
    }
}

//function used for brand
const GetProductsByCategoryList = async({categoryList}) => {
    try {
        const productList = await prisma.product.findMany({
            where: {
                category: {
                    category_id: {
                        in: categoryList.map(ele => ele.category_id)
                    }
                }
            }
        });
        return {productList: productList};
    } catch (err) {
        throw err;
    }
}

//wishlist
const checkWishList = async({product_id, user}) => {
    const validProductInWishList = await prisma.wishlist.findFirst({
        where: {
            user_id: user.userId,
            product_id: product_id
        }
    })
    return {validProductInWishList: validProductInWishList}
}

const addToWishList = async ({product_id, user}) => {
    try {
        const {product} = await GetProductById({product_id})
        const {validProductInWishList} = await checkWishList({product_id, user})

        if (!product) {
            throw new CustomError.BadRequestError(`This product does not exist`)
        }
        if (validProductInWishList)
        {
            throw new CustomError.BadRequestError(`This product existed in your wishlist`)
        }
        await prisma.wishlist.create({
            data: {
                user_id: user.userId,
                product_id: product_id
            }
        })

        const wishlistProducts = await retrieveFromWishList(user.userId)
        return wishlistProducts;
    }
    catch (err) {
        throw err;
    }
}

const removeFromWishList = async ({product_id, user}) => {
    try {
        const {validProductInWishList} = await checkWishList({product_id, user})
        if (!validProductInWishList)
        {
            throw new CustomError.BadRequestError(`This product does not exist in your wishlist`)
        }
        await prisma.wishlist.deleteMany({
            where: {
                user_id: user.userId,
                product_id: product_id
            }
        });

        const wishlistProducts = await retrieveFromWishList(user.userId)
        return wishlistProducts;
    }
    catch (err) {
        throw err;
    }
}

const retrieveFromWishList = async ({userId}) => {
    try {
        const getValues = await prisma.wishlist.findMany({
            where: {
                user_id: userId
            },
            include: {
                product: true
            }
        });
        const wishlist = getValues.map(item => {
            const { product_id, thumbnail, name, product } = item;
            const tmp = {
                product_id,
                thumbnail: product.thumbnail,
                name: product.name,
                ...(product.discount_percent > 0 ? { discount_price: product.discount_price } : { reg_price: product.reg_price })
            };
            return tmp;
        });
        return {list: wishlist};
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    addToWishList,
    removeFromWishList,
    retrieveFromWishList,
    GetProductsByCategoryList,
    GetProductsService
}