const express = require('express');
const router = express.Router();

const ReviewController = require('../controllers/review.controller')

const  {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')

router.route('/:id')
      .get(ReviewController.GetAllReview)
      .post(authenticateUser, ReviewController.CreateReview)

module.exports = router