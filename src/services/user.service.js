const prisma = require('../config/prisma.instance')
const helper = require('../helper')
const utils = require('../utils')
const CustomError = require('../errors')

const ProfileService = async({userId}) => {
    try {
        const select = helper.CustomResponse.UserResponse();
        const data = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select
        })
        return {data}
    } catch (err) {
        throw err;
    }
}

const UpdateUserService = async({userId, body}) => {
    try {
        const select = helper.CustomResponse.UserResponse();
        const data = await prisma.user.update({
            where: {
                id: userId
            },
            data: body,
            select
        });
        return {data};
    } catch (err) {
        throw err;
    }
}

const UpdatePasswordService = async({userId, body}) => {
    try {
        const {newPass, oldPass} = body;

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });

        const isPasswordCorrect = await utils.ComparePassword(oldPass, user.password);
        if(!isPasswordCorrect)
            throw new CustomError.UnauthenticatedError('Wrong password')

        const hassPassword = await utils.passwordHash(newPass);
        const newUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hassPassword
            }
        })
        
        return {data: newUser, msg: 'Password updated successfully'}

    } catch (err) {
        throw err;
    }
}

const GetAllUsersService = async() => {
    try {
        const select = helper.CustomResponse.UserResponse();
        const data = await prisma.user.findMany({
            select
        });
        return {data};
    } catch (err) {
        throw err;
    }
}

const ForgetPasswordService = async({body}) => {
    try {
        const {email, newPass} = body;
        if(!email) 
            throw new CustomError.BadRequestError('Please provide valid email');

        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });

        if(!user) 
            throw new CustomError.NotFoundError(`Not found ${email}`);

        const hassPassword = await utils.passwordHash(newPass);
        const data = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: hassPassword
            }
        });

        await prisma.oTP.delete({
            where: {
                user_email: email
            }
        })

        await utils.emailTemplate.forgotPasswordEmail({
            name: data.name,
            email: data.email,
        })
        
        return {msg: 'Please check your email for reset password'}
    } catch (err) {
        throw err;
    }
}

module.exports = {
    ProfileService,
    UpdateUserService,
    GetAllUsersService,
    ForgetPasswordService,
    UpdatePasswordService
}