const {StatusCodes} = require('http-status-codes')
const AuthService = require('../services/auth.service')
const helper = require('../helper')
const CustomError = require('../errors')

const register = async (req, res, next) => {
    try {
        const body = req.body

        //validate data
        const isFalse = await helper.registerValidate(body)
        if(isFalse.error) {
            throw new CustomError.BadRequestError(isFalse.error.message);
        }

        const {user} = await AuthService.CreateUser({body, res})
        res.status(StatusCodes.OK).json({user: user})
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const body = req.body
        const isFalse = await helper.loginValidate(body)
        if(isFalse.error) {
            throw new CustomError.BadRequestError(isFalse.error.message);
        }

        const {user} = await AuthService.loginService({body, res})
        res.status(StatusCodes.OK).json({user: user})
    } catch(err) {
        next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        const user = req.user;
        const { msg } = await AuthService.logout(user, res);
        res.status(StatusCodes.OK).json({ msg: msg });
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
}

const sendOTP = async (req, res, next) => {
    try {
        const body = req.body;
        const {data} = await AuthService.sendOTP({email: body.email});
        res.status(StatusCodes.OK).json({data: data});
    } catch (err) {
        next(err)
    }
}

const LoginWithGoogle = async(req, res, next) => {
    try {
         const body = req.body;
         const {user} = await AuthService.LoginWithGoogleService({body, res});
         res.status(StatusCodes.OK).json({user: user})
    } catch (err) {
        next(err)
    }
}

const reSendOTP = async (req, res, next) => {
    try {
        const body = req.body;
        const {data} = await AuthService.reSendOTP({email: body.email});
        res.status(StatusCodes.OK).json({data: data});
    } catch (err) {
        next(err)
    }
 }

module.exports = {
    register,
    login,
    logout, 
    sendOTP,
    LoginWithGoogle,
    reSendOTP
}