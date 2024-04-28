const express = require('express');
const router = express.Router();
const {
    GetAllCategory,
    CreateCategory,
    CreateCategoryGroup
} = require('../controllers/API/v1/category.controller')

const {
     authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

router.route('/')
      .get(GetAllCategory)
      .post([authenticateUser, authorizePermissions('admin')], CreateCategory)

router.route('/group').post([authenticateUser, authorizePermissions('admin')], CreateCategoryGroup)


module.exports = router