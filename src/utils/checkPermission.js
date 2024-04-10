const CustomError = require('../errors')

const checkPermissions = (reqUser, resourceUserId) => {
    if(reqUser.role === 'admin')
        return 
    if(reqUser.userId === resourceUserId.toString())
        return 
    throw new CustomError.UnauthenticatedError(
        'You are not allowed to access this'
    )
}

module.exports = checkPermissions;