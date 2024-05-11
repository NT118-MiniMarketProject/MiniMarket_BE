const {StatusCodes} = require('http-status-codes')
const userService = require('../services/user.service')

const showCurrentUser = async (req, res, next) => {
  try {
    const {userId} = req.user;
    const {data} = await userService.ProfileService({userId});
    res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    next(err)
  }
};

module.exports = {
    showCurrentUser
}