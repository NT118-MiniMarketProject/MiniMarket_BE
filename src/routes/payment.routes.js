const express = require('express')
const router = express.Router();

const {
     authenticateUser,
} = require('../middleware/authentication');
const PaymentService = require('../services/payment.service')

router.route('/').post(authenticateUser, PaymentService.momoPaymentService)
router.route('/notifications').post(PaymentService.updateAfterPayment)

module.exports = router
