const express = require('express');
const router = express.Router();
const {
     authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

const OrderController = require('../controllers/order.controller')

router.route('/').post(authenticateUser, OrderController.CreateOrder);

module.exports = router