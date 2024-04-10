const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt')
const createTokenUser = require('./createTokenUser')
// const checkPermissions = require('./checkPermissions')
// const CartPermissions = require('./CartPermission')
// const forgotPasswordEmail = require('./ForgetPassword')
const {
    passwordHash,
    ComparePassword
} = require('./passwordHash')
const createHash = require('./createHash')

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createTokenUser,
//   checkPermissions,
//   CartPermissions,
//   forgotPasswordEmail,
    passwordHash,
    createHash,
    ComparePassword
}