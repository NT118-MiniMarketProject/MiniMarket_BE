const service = require('../services/mailService')

const sendEmailController = async (req, res, next) => {
  const emailDetails = {
    name: req.body.name,
    products: req.body.products,
    email: req.body.email,
    address: req.body.address,
    amount: req.body.amount,
  }
  try {
    const email = await service.sendEmail(emailDetails)
    return res.status(200).json('Thanh cong!')
  } catch (err) {
    return err;
  }
}

module.exports = { sendEmailController }