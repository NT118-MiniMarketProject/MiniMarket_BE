const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller')
const  {
    authenticateUser,
    authorizePermissions
} = require('../middleware/authentication')

//wishList
router.get('/wishlist', authenticateUser, productController.getProductsInWishList);
router.post('/wishlist/add', authenticateUser, productController.addWishList);
router.post('/wishlist/remove', authenticateUser, productController.removeWishList);

//product
router.route('/')
      .get(productController.GetAllProducts)
      .post([authenticateUser, authorizePermissions('admin')], productController.CreateProduct)

router.post('/upload/:id', authenticateUser, authorizePermissions('admin'), productController.UploadImageForProduct)

router.get('/popular', productController.GetPopularProducts);
router.get('/relevent/:id', productController.GetReleventProduct);

router.route('/:id')
      .get(productController.GetDetailOfProducts)
      .put([authenticateUser, authorizePermissions('admin')], productController.UpdateProduct)
      .delete([authenticateUser, authorizePermissions('admin')], productController.DeleteProduct)
module.exports = router