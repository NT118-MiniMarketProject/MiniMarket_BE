const prisma = require('../config/prisma.instance')
const helper = require('../helper')
const utils = require('../utils')


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

        const {password} = body;
        let hassPassword;
        let newData = body;
        if(password) {
            hassPassword = await utils.passwordHash(password)
            newData = {
                ...body,
                password: hassPassword
            }
        }

        console.log(newData)
        const data = await prisma.user.update({
            where: {
                id: userId
            },
            data: newData,
            select
        });
        return {data};
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

module.exports = {
    ProfileService,
    UpdateUserService,
    GetAllUsersService
}