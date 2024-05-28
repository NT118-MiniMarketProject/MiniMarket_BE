const moment = require('moment')


const checkOutVNPay = async (req, res, next) => {
  process.env.TZ = 'Asia/Ho_Chi_Minh'

  //Order
  const { name, email, products, address, amount } = req.body
  // console.log({ name, email, products, address, amount } )
  // console.log(amount)
  // let dump_products = [
  //   { productName: 'Sản phẩm 1', price: 50.0 },
  //   { productName: 'Sản phẩm 2', price: 30.0 },
  // ]
  //Checkout

  let date = new Date()
  let createDate = moment(date).format('YYYYMMDDHHmmss')

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress

  let config = require('../config/vn-pay.json')

  let tmnCode = config.vnp_TmnCode
  let secretKey = config.vnp_HashSecret
  let vnpUrl = config.vnp_Url
  let returnUrl = config.vnp_ReturnUrl
  let orderId = moment(date).format('DDHHmmss')
  let bankCode = 'NCB'

  let locale = 'vn'
  // if (locale === null || locale === '') {
  //   locale = 'vn'
  // }
  let currCode = 'VND'
  let vnp_Params = {}
  vnp_Params['vnp_Version'] = '2.1.0'
  vnp_Params['vnp_Command'] = 'pay'
  vnp_Params['vnp_TmnCode'] = tmnCode
  vnp_Params['vnp_Locale'] = locale
  vnp_Params['vnp_CurrCode'] = currCode
  vnp_Params['vnp_TxnRef'] = orderId
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
  vnp_Params['vnp_OrderType'] = 'other'
  vnp_Params['vnp_Amount'] = amount * 100
  vnp_Params['vnp_ReturnUrl'] = returnUrl
  vnp_Params['vnp_IpAddr'] = ipAddr
  vnp_Params['vnp_CreateDate'] = createDate

  vnp_Params = sortObject(vnp_Params)

  let querystring = require('qs')
  let signData = querystring.stringify(vnp_Params, { encode: false })
  let crypto = require('crypto')
  let hmac = crypto.createHmac('sha512', secretKey)
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
  vnp_Params['vnp_SecureHash'] = signed
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })
  emailDetail.name = name
  emailDetail.email = email
  emailDetail.products = products //dump_products
  emailDetail.address = address
  emailDetail.amount = amount
  // console.log(vnp_Params)
  // res.redirect(vnpUrl);
  return res.json({ vnpUrl })
}

function sortObject(obj) {
  let sorted = {}
  let str = []
  let key
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key))
    }
  }
  str.sort()
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
  }
  return sorted
}

const vnpay_return = async (req, res, next) => {
  let vnp_Params = req.query
  try {
    const mail = await service.sendEmail(emailDetail)
  } catch (err) {
    // console.log(err)
    return err
  }
  return res.json({ code: vnp_Params['vnp_ResponseCode'] })
}

module.exports = {
  checkOutVNPay,
  vnpay_return,
}