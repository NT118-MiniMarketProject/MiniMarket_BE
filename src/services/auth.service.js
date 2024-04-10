const {prisma} = require('../config/prisma.instance')
const CustomError = require('../errors')
const {
    passwordHash,  
    attachCookiesToResponse,
    createTokenUser,
    ComparePassword
} = require('../utils')

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
        attachCookiesToResponse({ res, user: tokenUser })

        return {user: tokenUser}
    } catch(err) {
        throw new CustomError.BadRequestError(err)
    }
}


module.exports = {
    CreateUser,
    loginService
}