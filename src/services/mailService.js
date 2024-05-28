const nodemailer = require('nodemailer')

const sendEmail = async (emailDetail) => {
  let testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.PASSWORD_EMAIL,
    },
  })

  let info = await transporter.sendMail({
    from: '"TuliBear" <testlaravelalala@gmail.com>',
    to: emailDetail.email,
    subject: 'Hello',
    html: `
    <p>Xin chào ${emailDetail.name},</p>
    <p>Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi. Dưới đây là chi tiết đơn hàng của bạn:</p>
    <ul>
      ${emailDetail.products
        .map(
          (product) => `
        <li>
          <strong>Sản phẩm:</strong> ${product.productName} - 
          <strong>Giá:</strong> ${product.price} đ
        </li>
      `
        )
        .join('')}
    </ul>
    <p><strong>Tổng cộng:</strong> ${emailDetail.amount} đ</p>
    <p><strong>Địa chỉ giao hàng:</strong> ${emailDetail.address}</p>
    <p>Xin vui lòng kiểm tra thông tin đơn hàng của bạn. Chúng tôi sẽ thông báo cho bạn khi đơn hàng của bạn đã được gửi đi.</p>
    <p>Xin cảm ơn và chúc bạn một ngày tốt lành!</p>
  `,
  })
}

module.exports = { sendEmail }