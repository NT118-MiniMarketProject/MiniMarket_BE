const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller')

router.route('/categoryGroup/:id').get(brandController.GetBrandByCategoryGroup)
router.route('/category/:id').get(brandController.GetBrandByCategory)
router.route('/').get(brandController.GetAllBrand);

module.exports = router