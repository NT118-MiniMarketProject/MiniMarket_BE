const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

const userController = require('../controllers/user.controller')

router.route('/showMe').get(authenticateUser, userController.showCurrentUser);

module.exports = router 