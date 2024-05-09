const express = require('express');
const router = express.Router();
const categoryService = require('../controllers/category.controller')

const {
     authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

router.route('/')
      .get(categoryService.GetAllCategory)
      .post([authenticateUser, authorizePermissions('admin')], categoryService.CreateCategory)

router.route('/group')
      .post([authenticateUser, authorizePermissions('admin')], categoryService.CreateCategoryGroup)
      .get(categoryService.GetAllCategoryGroups)

router.get('/group/all', categoryService.GetCategoryByCategoryGroupAll);
router.get('/group/:id', categoryService.GetCategoryGroupById);
router.get('/group/search/:id', categoryService.GetProductByCategoryGroup);


module.exports = router