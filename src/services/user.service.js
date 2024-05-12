const prisma = require('../config/prisma.instance')
const helper = require('../helper')


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
        const data = await prisma.user.update({
            where: {
                id: userId
            },
            data: body
        });
        return {data};
    } catch (err) {
        throw err;
    }
}

module.exports = {
    ProfileService,
    UpdateUserService
}