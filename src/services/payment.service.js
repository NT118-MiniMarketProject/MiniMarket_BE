const crypto = require('crypto');
const https = require('https');
const axios = require('axios');
const prisma  = require('../config/prisma.instance')
const OrderService = require('./order.service')

const momoPaymentService = async(req, res) => {
    const {order_id, total} = req.body;
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const orderInfo = "Thanh toán tiền hàng";
    const partnerCode = "MOMO";
    const partnerName = "Bách hoá xanh Clone";
    const redirectUrl = "https://momo.vn";
    const ipnUrl = "https://minimarket-be.onrender.com/api/v1/payment/notifications";
    const requestType = "captureWallet";
    const amount = total;
    const orderId = order_id + partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = ""; // Empty string if there is no extra data
    const orderGroupId = ""; // Optional field, if not required, leave it as an empty string
    const autoCapture = true;
    const lang = "vi";

    // Generate raw signature
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    // Create signature using HMAC SHA256
    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(rawSignature)
        .digest("hex");
    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

    // JSON object to send to MoMo endpoint
    const requestBody = {
        partnerCode: partnerCode,
        partnerName: partnerName,
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
    };

    console.log("--------------------REQUEST BODY----------------");

    const options = {
        method: "POST",
        url: "https://test-payment.momo.vn/v2/gateway/api/create",
        headers: {
            "Content-Type": "application/json",
        },
        data: requestBody,
    };
    try {
        const result = await axios(options);
        return res.json({
            status: "success",
            data: result.data,
        });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        return res.json({
            status: "error",
            msg: "server error",
            error: error.response ? error.response.data : error.message,
        });
    }
}

const updateAfterPayment = async (req, res) => {
    const {orderId, resultCode} = req.body;
    const index = orderId.indexOf("MOMO");
    const order_id = orderId.substring(0, index)
    if(resultCode == 0) {
        const newData = {
            status: "PaidNotDelivered",
            payment_method: "MOMO"
        }
        await OrderService.UpdateService({orderId: order_id, body: newData})
    } else {
        return
    }
}

module.exports = {
    momoPaymentService,
    updateAfterPayment
}