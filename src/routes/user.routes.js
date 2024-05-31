const express = require('express');
const router = express.Router();
const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

const userController = require('../controllers/user.controller')

router.route('/showMe').get(authenticateUser, userController.showCurrentUser)
                       .post(authenticateUser, userController.UploadAvatar)

router.route('/')
      .post(authenticateUser, userController.UpdateUser)
      .get([authenticateUser, authorizePermissions('admin')], userController.GetAllUsers)

router.post('/forgetPassword', userController.ForgetPassword)
router.post('/updatePassword', authenticateUser ,userController.UpdatePassword)

module.exports = router 