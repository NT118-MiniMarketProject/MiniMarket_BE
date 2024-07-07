const prisma = require('../config/prisma.instance')
const CustomError = require('../errors')
const {
    passwordHash,  
    attachCookiesToResponse,
    createTokenUser,
    ComparePassword
} = require('../utils')
const crypto = require('crypto')
const utils = require('../utils');

const CreateUser = async({body, res}) => {
    try {
        const {email, password, name, phone} = body

        const emailAlreadyExists = await prisma.user.findUnique({where: {email}})
        if(emailAlreadyExists) {
            throw new CustomError.BadRequestError(`Email already exists`)
        }

        const isFirstAccount = await prisma.user.count() === 0
        const role = isFirstAccount ? 'admin' : 'customer'

        const hassPassword = await passwordHash(password)
        
        const saveUser = await prisma.user.create({
            data: {
                email,
                name, 
                password: hassPassword,
                phone, 
                role
            }
        })

        const tokenUser = createTokenUser(saveUser)

        attachCookiesToResponse({res, user: tokenUser})

        await utils.emailTemplate.WelcomeEmail({user: saveUser});

        return {user: tokenUser}
    } catch (err) {
        throw new CustomError.BadRequestError(err);
    }
}

const loginService = async({body, res}) => {
    try {
        const {email, password} = body
        if(!email || !password) 
            throw new CustomError.BadRequestError('Please provide email or password')

        const user = await prisma.user.findUnique({where: {email}})

        if(!user) 
            throw new CustomError.UnauthenticatedError('Not exist')

        const isPasswordCorrect = await ComparePassword(password, user.password)
        if(!isPasswordCorrect)
            throw new CustomError.UnauthenticatedError('Wrong password')

        const tokenUser = createTokenUser(user)
        // console.log(tokenUser)

        let refresh_token = ''

        const existingToken = await prisma.token.findFirst({
            where:{
                user_id: user.id
            }
        })

        if(existingToken) {
            const {isValid} = existingToken;
            if(!isValid) 
                throw new CustomError.UnauthenticatedError('Invalid Credentials')
            refresh_token = existingToken.refresh_token
            attachCookiesToResponse({res, user: tokenUser, refreshToken: refresh_token})
            return {user: tokenUser}
        }
 
        refresh_token = crypto.randomBytes(40).toString('hex');

        await prisma.token.create({
            data: {
                refresh_token,
                user_id: user.id
            }
        })

        attachCookiesToResponse({ res, user: tokenUser, refreshToken: refresh_token })

        return {user: tokenUser}
    } catch(err) {
        throw new CustomError.BadRequestError(err)
    }
}

const getUserById = async (userId) => {
    try {
        const user = await prisma.user.findUnique({where: {id: userId}})
        return {user: user}
    } catch(err) {
        throw err
    }
}


const updateUserById = async (userId, dataUpdateFromRequest) => {
    try {
        const dataUpdate = {}
        dataUpdate.refreshToken = dataUpdateFromRequest.refreshToken ?? dataUpdateFromRequest.refreshToken;

        const userUpdate = await prisma.user.update({
            where: {
                id: userId
            },
            data: dataUpdate
        });

        return {userUpdate: userUpdate}
    } catch(err) {
        throw err
    }
}

const logout = async (user, res) => {
    try {
        await prisma.token.deleteMany({
                where: {
                    user_id: user.userId
                }
            })

        res.cookie('accessToken', 'logout', {
                httpOnly: true,
                expires: new Date(Date.now()),
        })

        res.cookie('refreshToken', 'logout', {
                httpOnly: true,
                expires: new Date(Date.now()),
        })

        return {msg: 'user logged out!'}
    } catch (err) {
        throw err
    }
}

const sendOTP = async ({email}) => {
    try {
        const otp = Math.floor(Math.random() * 9000) + 1000;
        const OTPSend = await prisma.oTP.create({
            data: {
                user_email: email,
                otp_value: otp
            }
        })

        await utils.emailTemplate.sendOTPForCustomer({OTPSend});

        return {data: OTPSend.otp_value}

    } catch(err) {
        throw err
    }
}

const reSendOTP = async({email}) => {
    try {
        await prisma.oTP.delete({
            where: {
                user_email: email
            }
        })

        const {data} = await sendOTP({email});

    return {data}
    } catch (err) {
        throw err
    }
}

const LoginWithGoogleService = async({body, res}) => {
    let saveUser;
    try {
        const {displayName, email, avatar} = body;
        let GGUser = await prisma.user.findFirst({
            where: {
                email: email,
                googleId: true
            }
        })

        if(!GGUser) {
            const data = {
                email,
                name: displayName,
                role: 'customer',
                googleId: true,
                avater: avatar
            }
            saveUser = await prisma.user.create({
                data
            })
        } else {
            saveUser = GGUser;
        }

        const tokenUser = createTokenUser(saveUser)

        attachCookiesToResponse({res, user: tokenUser})

        return {user: tokenUser}
    } catch (err) {
        throw err
    }
}

module.exports = {
    CreateUser,
    loginService,
    getUserById,
    updateUserById,
    logout,
    sendOTP,
    LoginWithGoogleService,
    reSendOTP
}