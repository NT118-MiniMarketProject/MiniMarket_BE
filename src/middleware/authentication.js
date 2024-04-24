const { prisma } = require('../config/prisma.instance')
const CustomError = require('../errors')
const {isTokenValid,attachCookiesToResponse} = require('../utils')

const authenticateUser = async(req, res, next) => {

    const {refreshToken, accessToken} = req.signedCookies
    // console.log(refreshToken)
    // console.log(accessToken)

    if(!refreshToken || !accessToken) {
        throw new CustomError.BadRequestError(`Can't logout now`);
    }

    try {
        if(accessToken) {
            const payload = isTokenValid(accessToken)
            req.user = payload.user
            return next()
        }

        const payload = isTokenValid(refreshToken)
        // console.log(payload.refreshToken)

        const existingToken = await prisma.token.findFirst({
            where: {
                refresh_token: payload.refreshToken,
                user_id: payload.user.userId
            }
        })

        if (!existingToken || !existingToken?.isValid) {
            throw new CustomError.UnauthenticatedError('Authentication Invalid');
        }

        attachCookiesToResponse({
            res,
            user: payload.user,
            refreshToken: payload.refreshToken
        })

        req.user = {
            user: payload.user,
            refreshToken: payload.refreshToken
        }
        next()
    } catch(err) {
        console.log(err)
    }
}

const authorizPermissions = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            throw new CustomError.UnauthenticatedError(
                'Unauthorized to access this route'
            );
        }
        next();
    }
}

module.exports = {
    authenticateUser,
    authorizPermissions
}