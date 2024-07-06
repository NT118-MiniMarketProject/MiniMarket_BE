const paymentService = require('../services/payment.service')

const momoPayment = async(req, res, next) => {
  try {
    paymentService.momoPaymentService(req.body, res)
  } catch (err) {
    next(err);
  }
}

module.exports = {
  momoPayment
}