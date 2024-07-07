const prisma = require('../config/prisma.instance');
const CustomError = require('../errors')
const ProductService = require('./product.service')
const CustomResponse = require('../helper/CustomResponse')
const redis = require('../config/redis')

// const main = async () => {
//   try {
//     const keys = await redis.getKeys();
//     console.log('Keys in Redis:', keys);
//   } catch (err) {
//     console.error('Error fetching keys:', err);
//   }
// };

// main();

const GetAllReviewService = async({product_id}) => {
    try {

        const redisClient = redis.connectToRedis(); // Initialize Redis client

    // Check if data exists in Redis
        const cachedReviews = await redisClient.get(`reviews:${product_id}`);

        if (cachedReviews) {
            console.log('Returning cached reviews from Redis');
            return JSON.parse(cachedReviews); // Return cached data if exists
        }


        const {product} = await ProductService.GetProductByIdService({product_id});
        if(!product) 
            throw new CustomError.NotFoundError('Product not found');

        const reviewData = await prisma.reviews.findMany({
            where: {
                productId: product_id
            },
            select: {
                reviewId: true,
                rating: true,
                title: true,
                comment: true,
                created_at: true,
                productId: true,
                userId: true,
                user: {
                    select: {
                        name: true,
                        avater: true
                    }
                }
            }
        })

         const formattedReviews = reviewData.map(review => ({
            reviewId: review.reviewId,
            rating: review.rating,
            title: review.title,
            comment: review.comment,
            created_at: review.created_at,
            productId: review.productId,
            userId: review.userId,
            user_name: review.user.name, 
            user_avater: review.user.avater 
        }));

        await redisClient.set(`reviews:${product_id}`, JSON.stringify(formattedReviews), 'EX', 3600);

        return {data: formattedReviews}
    } catch (err) {
       throw err;
    }
}

const CreateReviewForProductService = async({userId, orderitem_id, body}) => {
    try {
        const select = CustomResponse.OrderItemResponse();
        const orderItem = await prisma.orderItem.findFirst({
            where:{
                orderitem_id: orderitem_id
            },
            select
        }) 

        const newData = {
            ...body,
            productId: orderItem.products.product_id,
            userId: userId
        }
        const data = await prisma.reviews.create({
            data: newData
        })

        await prisma.orderItem.update({
            where: {
                orderitem_id: orderitem_id
            },
            data: {
                IsReview: true
            }
        })

        const redisKey = `reviews:${orderItem.products.product_id}`;
        const cachedData = await redisClient.get(redisKey);

        if (cachedData) {
            console.log('Cache exists. Deleting cache...');
            await redisClient.del(redisKey);
            console.log(`Cache for product reviews (product_id: ${orderItem.products.product_id}) has been cleared.`);
        } else {
            console.log('No cache found for this product.');
        }

        return {data}
    } catch (err) {
        throw err;
    }
}

module.exports = {
    GetAllReviewService,
    CreateReviewForProductService
}