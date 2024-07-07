const joi = require('joi');

const registerValidate = (data) => {
    const accountSchema = joi.object({
        email: joi.string().email().lowercase().required(), 
        name: joi.string().required(),
        password: joi.string().min(8).max(32).required(),
        phone: joi.string().pattern(/^(0\d{9})$/).required(),
        otp_user: joi.number()
    });
    return accountSchema.validate(data)
}

const loginValidate = async (data) => {
    const accountSchema = joi.object({
        email: joi.string().email().lowercase().required(), 
        password: joi.string().min(8).max(32).required(),
    })
    return accountSchema.validate(data)
}

module.exports = {
    registerValidate,
    loginValidate
}