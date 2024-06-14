const express = require('express');
const router = express.Router()
const saleController = require('../controllers/sale.controller')
const  {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')

router.get('/', saleController.getSales)
router.get('/:eventId', saleController.getSaleItems)
router.post('/addSaleEvent',[authenticateUser, authorizePermissions('admin')], saleController.addSaleEvent)

module.exports = router