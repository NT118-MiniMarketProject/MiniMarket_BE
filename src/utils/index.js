const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./createTokenUser')
const checkPermissions = require('./checkPermission')
const CartPermissions = require('./cartPermission')
// const forgotPasswordEmail = require('./ForgetPassword')
const {
    passwordHash,
    ComparePassword
} = require('./passwordHash')
const {
    uploadImageConfig,
    uploadImage
} = require('./uploadFile')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
  checkPermissions,
  CartPermissions,
//   forgotPasswordEmail,
    passwordHash,
    ComparePassword,
    uploadImage,
    uploadImageConfig
}