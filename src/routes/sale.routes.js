const express = require('express');
const router = express.Router()
const saleController = require('../controllers/sale.controller')

router.get('/', saleController.getSales)

module.exports = router