const {StatusCodes} = require('http-status-codes')
const userService = require('../services/user.service')
const utils = require('../utils')

const showCurrentUser = async (req, res, next) => {
  try {
    const {userId} = req.user;
    const {data} = await userService.ProfileService({userId});
    res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    next(err);
  }
};

const UpdateUser = async (req, res, next) => {
  try {
    const {data} = await userService.UpdateUserService({userId: req.user.userId, body: req.body});
    res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    next(err);
  }
}

const UploadAvatar = async(req, res, next) => {
  try {
    const file = req.files ? req.files.image.tempFilePath : null;
    const data = await utils.uploadImage(req.user.userId, file, 1);
    res.status(StatusCodes.OK).json({ data });
  } catch (err) {
    next(err);
  }
}

const GetAllUsers = async (req, res, next) => {
  try {
    const {data} = await userService.GetAllUsersService();
    res.status(StatusCodes.OK).json({data});
  } catch(err) {
    next(err)
  }
}

const ForgetPassword = async (req, res, next) => {
  try {
      const {email} = req.body;
      const {msg} = await userService.ForgetPasswordService(email);
      res.status(StatusCodes.OK).json({ msg })
  } catch (err) { 
     next(err);
  }
}

const UpdatePassword = async (req, res, next) => {
  try {
    const {data, msg} = await userService.UpdatePasswordService({userId: req.user.userId, body: req.body});
    res.status(StatusCodes.OK).json({msg, data});
  } catch (err) {
    next(err);
  }
}

module.exports = {
    showCurrentUser,
    UpdateUser,
    UploadAvatar,
    GetAllUsers,
    ForgetPassword,
    UpdatePassword
}