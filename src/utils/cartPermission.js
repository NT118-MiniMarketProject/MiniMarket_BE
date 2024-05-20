const CustomError = require('../errors')

const CartPermissions = (reqUser, resourceUserId) => {
    if(reqUser.userId === resourceUserId.toString())
        return 
    throw new CustomError.UnauthenticatedError(
        'Bạn không có sở hữu tài khoản này'
    )
}

module.exports = CartPermissions;