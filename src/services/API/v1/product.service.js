const {prisma} = require('../../../config/prisma.instance');

const addToWishList = async ({body, user}) => {
    try {
        const {product_id} = body

        await prisma.wishlist.create({
            data: {
                user_id: user.userId,
                product_id: product_id
            }
        })

        const wishlistProducts = await prisma.wishlist.findMany({
            where: {
                user_id: req.user.userId
            },
            include: {
                product: true
            }
        });
        return {list: wishlistProducts};
    }
    catch (err) {
        throw err;
    }
}

const removeFromWishList = async ({body, user}) => {
    try {
        const {product_id} = body
        await prisma.wishlist.deleteMany({
            where: {
                user_id: user.userId,
                product_id: product_id
            }
        });

        const wishlistProducts = await prisma.wishlist.findMany({
            where: {
                user_id: user.userId
            },
            include: {
                product: true
            }
        });
        return {list: wishlistProducts};
    }
    catch (err) {
        throw err;
    }
}

module.exports = {
    addToWishList,
    removeFromWishList
}