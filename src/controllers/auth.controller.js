const {StatusCodes} = require('http-status-codes')
const AuthService = require('../services/auth.service')

const register = async (req, res, next) => {
    try {
        const body = req.body
        const {user} = await AuthService.CreateUser({body, res})
        res.status(StatusCodes.OK).json({user: user})
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const body = req.body
        const {user} = await AuthService.loginService({body, res})
        res.status(StatusCodes.OK).json({user: user})
    } catch(err) {
        next(err)
    }
}

module.exports = {
    register,
    login
}