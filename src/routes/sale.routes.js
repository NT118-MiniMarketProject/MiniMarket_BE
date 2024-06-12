const express = require('express');
const  {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')
const router = express.Router()
const saleController = require('../controllers/sale.controller')

router.get('/', saleController.getSales)
router.get('/:eventId', saleController.getSaleItems)
router.post('/addSaleEvent',[authenticateUser, authorizePermissions('admin')], saleController.addSaleEvent)

module.exports = router