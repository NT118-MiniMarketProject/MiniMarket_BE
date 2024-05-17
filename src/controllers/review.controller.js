const { date } = require('joi');
const ReviewService = require('../services/review.service')
const {StatusCodes} = require('http-status-codes')

const GetAllReview = async(req, res, next) => {
    try {
        const product_id = req.params.id
        const {data} = await ReviewService.GetAllReviewService({product_id});
        res.status(StatusCodes.OK).json({data})
    } catch (err) {
        next(err)
    }
}

const CreateReview = async(req, res, next) => {
    try {
        const {userId} = req.user
        const product_id = req.params.id
        const {data} = await ReviewService.CreateReviewForProductService({userId, product_id, body: req.body});
        res.status(StatusCodes.OK).json({data})
    } catch (err) {
        next(err)
    }
}

module.exports = {
    GetAllReview,
    CreateReview
}