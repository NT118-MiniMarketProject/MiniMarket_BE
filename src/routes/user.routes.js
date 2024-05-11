const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

const userController = require('../controllers/user.controller')

router.route('/showMe').get(authenticateUser, userController.showCurrentUser)
                       .post(authenticateUser, userController.UploadAvatar)

router.post('/', authenticateUser, userController.UpdateUser);

module.exports = router 