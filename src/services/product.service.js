const prisma = require('../config/prisma.instance');
const CustomError = require('../errors')
const helper = require('../helper')


//Common
const GetProductByIdService = async({product_id}) => {
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
        const where = {...helper.queryProduct.SearchQuery(query)}
        // console.log(where)

        const orderBy = helper.queryProduct.QuerySort(query.sort)
        // console.log(orderBy)

        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit;

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

//products
const GetPopularProductsService = async() => {
    const query = {
        popular: 1
    }; 
    const {products} = await GetProductsService(query);

    const CategoryIds = [...new Set(products.map(product => product.c_id))];

    const popularProduct = await prisma.category.findMany({
        where: {
            category_id: {
                in: CategoryIds
            }
        }, 
        select: {
            category_id: true,
            category_name: true,
            products: {
                where: {
                    is_feature: 1
                },
                take: 5
            }
        }
    });

    return {data: popularProduct}
}

const GetDetailOfProductService = async({productId}) => {
    try {
        const {product: ValidId} = await GetProductByIdService({product_id: productId});

        if(!ValidId)
            throw new CustomError.NotFoundError(`Not found productId: ${productId}`)

        const data = await prisma.product.findUnique({
            where: {
                product_id: productId
            },
            include: {
                galleries: true
            }
        })
        return {data}
    } catch (err) {
        throw err;
    }
}

const GetReleventProductService = async({productId}) => {
    try {
        const {product: ValidId} = await GetProductByIdService({product_id: productId});

        if(!ValidId)
            throw new CustomError.NotFoundError(`Not found productId: ${productId}`);

        const products = await prisma.product.findMany({
            where: {
                c_id: ValidId.c_id
            }
        })

        const ProductIds = [...new Set(products.map(product => product.product_id))];
        const randomProductIds = ProductIds.sort(() => 0.5 - Math.random()).slice(0, 5);

        const data = await prisma.product.findMany({
            where: {
                product_id: {
                    in: randomProductIds
                }
            }
        });
        return {data}
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
        const {product} = await GetProductByIdService({product_id})
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
    GetProductsService,
    GetPopularProductsService,
    GetDetailOfProductService,
    GetReleventProductService
}