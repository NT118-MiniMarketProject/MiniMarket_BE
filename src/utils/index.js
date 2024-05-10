const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./createTokenUser')
// const checkPermissions = require('./checkPermissions')
// const CartPermissions = require('./CartPermission')
// const forgotPasswordEmail = require('./ForgetPassword')
const {
    passwordHash,
    ComparePassword
} = require('./passwordHash')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
//   checkPermissions,
//   CartPermissions,
//   forgotPasswordEmail,
    passwordHash,
    ComparePassword
}