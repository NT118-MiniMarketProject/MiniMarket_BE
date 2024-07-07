const express = require('express')
const router = express.Router()

const {
    register,
    login,
    logout,
    sendOTP,
    LoginWithGoogle,
    reSendOTP
} = require('../controllers/auth.controller')

const  {
    authenticateUser
} = require('../middleware/authentication')


router.post('/register', register)
router.post('/login', login)
router.delete('/logout', authenticateUser, logout)
router.post('/otp', sendOTP)
router.post('/gglogin', LoginWithGoogle)
router.post('/resendOTP', reSendOTP)

module.exports = router     