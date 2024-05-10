const express = require('express')
const router = express.Router()

const {
    register,
    login,
    logout
} = require('../controllers/auth.controller')

const  {
    authenticateUser
} = require('../middleware/authentication')


router.post('/register', register)
router.post('/login', login)
router.delete('/logout', authenticateUser, logout)

module.exports = router     