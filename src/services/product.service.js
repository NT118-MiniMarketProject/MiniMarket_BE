const prisma = require('../config/prisma.instance');
const CustomError = require('../errors')
const addToWishList = async ({body, user}) => {
    try {
        const {product_id} = body

        const validProduct = await prisma.product.findUnique({where: {product_id}})
        const validProductInWishList = await prisma.wishlist.findFirst({
            where: {
                user_id: user.userId,
                product_id: product_id
            }
        })
        if (!validProduct) {
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
        return {list: wishlistProducts};
    }
    catch (err) {
        throw err;
    }
}

const removeFromWishList = async ({body, user}) => {
    try {
        const {product_id} = body
        const validProductInWishList = await prisma.wishlist.findFirst({
            where: {
                user_id: user.userId,
                product_id: product_id
            }
        })
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
        return {list: wishlistProducts};
    }
    catch (err) {
        throw err;
    }
}

const retrieveFromWishList = async (userId) => {
    try {
        const wishlistProducts = await prisma.wishlist.findMany({
            where: {
                user_id: userId
            },
            include: {
                product: true
            }
        });
        return wishlistProducts;
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    addToWishList,
    removeFromWishList
}