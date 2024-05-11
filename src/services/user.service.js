const prisma = require('../config/prisma.instance')
const CustomError = require('../errors')
const {
    passwordHash,  
    attachCookiesToResponse,
    createTokenUser,
    ComparePassword
} = require('../utils')
const crypto = require('crypto')

const ProfileService = async({userId}) => {
    try {
        const data = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                name: true, 
                email: true,
                phone: true,
                address: true,
                avater: true,
                role: true
            }
        })
        return {data}
    } catch (err) {
        throw err;
    }
}

module.exports = {
    ProfileService
}