const sendEmail = require('./sendMail')

const forgotPasswordEmail = async ({name, email}) => {
    const message = 
    `
        <html>
        <head>
            <style>
                /* CSS để căn giữa nội dung */
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    background-color: #f4f4f4;
                }
                .container {
                    margin: 0 auto;
                    max-width: 600px;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                }
                .content {
                    padding: 20px;
                    text-align: left;
                }
                .footer {
                    background-color: #f0f0f0;
                    padding: 10px;
                    border-bottom-left-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Thông báo: Thay đổi mật khẩu thành công</h2>
                </div>
                <div class="content">
                    <p>Xin chào ${name},</p>
                    <p>Chúc mừng bạn đã thay đổi mật khẩu thành công cho tài khoản của mình.</p>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ hỗ trợ BHX-Clone</p>
                </div>
                <div class="footer">
                    <p>Đây là email tự động. Vui lòng không trả lời.</p>
                </div>
            </div>
        </body>
        </html>
    `;
    return sendEmail({
        to: email,
        subject: 'Reset Password',
        html: message
    })
}

const EmailCreateOrder = async({data, userData}) => {
    let message = `
        <p>Xin chào ${userData.name},</p>
        <p>Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi. Dưới đây là chi tiết đơn hàng của bạn:</p>
        <ul>
        ${data.orderitems
            .map(
            (product) => `
            <li>
            <strong>Sản phẩm:</strong> ${product.products.name} - 
            <strong>Giá:</strong> ${product.products.reg_price}đ -
            <strong>Số lượng:</strong> ${product.quantity}
            </li>
        `
            )
            .join('')}
        </ul>
        <p><strong>Tổng cộng:</strong> ${data.total}đ</p>
        <p><strong>Địa chỉ giao hàng:</strong> ${data.address}</p>
        <p>Xin vui lòng kiểm tra thông tin đơn hàng của bạn. Chúng tôi sẽ thông báo cho bạn khi đơn hàng của bạn đã được gửi đi.</p>
        <p>Xin cảm ơn và chúc bạn một ngày tốt lành!</p>
    `;
    try {
        return sendEmail({
            to: userData.email,
            subject: `Đơn hàng ${data.order_id} được tạo thành công`,
            html: message,
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const sendOTPForCustomer = async({OTPSend}) => {
    let message = `
        <html>
        <head>
            <style>
                /* CSS để căn giữa nội dung */
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                }
                .container {
                    margin: 0 auto;
                    max-width: 600px;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>OTP Verification</h2>
                <p>Your OTP for verification is: <strong>${OTPSend.otp_value}</strong></p>
            </div>
        </body>
        </html>
    `;
    try {
        return sendEmail({
            to: OTPSend.user_email,
            subject: `OTP Verification`,
            html: message
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const WelcomeEmail = async({user}) => {
    let message = `
        <html>
        <head>
            <style>
                /* CSS để căn giữa nội dung */
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    background-color: #f4f4f4;
                }
                .container {
                    margin: 0 auto;
                    max-width: 600px;
                    padding: 20px;
                    background-color: #ffffff;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #4CAF50;
                    color: white;
                    padding: 10px;
                    border-top-left-radius: 5px;
                    border-top-right-radius: 5px;
                }
                .content {
                    padding: 20px;
                    text-align: left;
                }
                .footer {
                    background-color: #f0f0f0;
                    padding: 10px;
                    border-bottom-left-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h2>Chào mừng bạn đến với ứng dụng của chúng tôi!</h2>
                </div>
                <div class="content">
                    <p>Xin chào ${user.name},</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản thành công. Chúng tôi rất vui khi chào đón bạn gia nhập cộng đồng của chúng tôi!</p>
                    <p>Bây giờ bạn có thể truy cập vào tài khoản của mình và khám phá các tính năng mà chúng tôi cung cấp.</p>
                    <p>Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, hãy liên hệ với chúng tôi.</p>
                    <p>Trân trọng,<br> 
                    Đội ngũ BHX-Clone</p>
                </div>
                <div class="footer">
                    <p>Đây là một email tự động. Vui lòng không trả lời.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    try {
        return sendEmail({
            to: user.email,
            subject: `Chào mừng bạn đến với ứng dụng của chúng tôi!`,
            html: message
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

const EmailCancelOrder = async({orderId, userData}) => {
    let message = `
        <p>Xin chào ${userData.name},</p>
        <p>Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi.</p>
        <p>Tuy nhiên trong quá trình xử lý thì đơn đặt hàng của bạn <strong>(${orderId})</strong> đã xảy ra lỗi nên buộc lòng chúng tôi phải hủy bỏ.</p>
        <p>Chúng tôi rất xin lỗi vì sự bất tiện này. Hy vọng bạn vẫn đồng hành và lựa chọn các sản phẩm bên cửa hàng của chúng tôi.</p>
        <p>Xin cảm ơn và chúc bạn một ngày tốt lành!</p>
    `;
    try {
        return sendEmail({
            to: userData.email,
            subject: `Đơn hàng ${orderId} xảy ra lỗi`,
            html: message,
        })
    } catch (err) {
        console.log(err);
        throw err;
    }
}

module.exports = {
    forgotPasswordEmail,
    EmailCreateOrder,
    sendOTPForCustomer,
    WelcomeEmail,
    EmailCancelOrder
}