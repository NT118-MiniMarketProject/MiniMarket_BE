const {prisma} = require('../../../config/prisma.instance');

// Add new product to user's wishlist
const addToWishList = async ({body, req, res}) => {
    try {
        const {product_id} = body
        const saveToDb = await prisma.wishlist.create({
            data: {
                user_id: req.user.userId,
                product_id: product_id
            }
        })
        // Fetch all products in the wishlist of the user
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
// Delete a product from a user's wishlist
const removeFromWishList = async ({body, req, res}) => {
    try {
        const {product_id} = body
        await prisma.wishlist.deleteMany({
            where: {
                user_id: req.user.userId,
                product_id: product_id
            }
        });
        // Fetch all products in the wishlist of the user
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

module.exports = {
    addToWishList,
    removeFromWishList
}