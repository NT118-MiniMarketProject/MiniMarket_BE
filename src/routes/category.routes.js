const express = require('express');
const router = express.Router();
const {
    GetAllCategory,
    CreateCategory,
    CreateCategoryGroup
} = require('../controllers/API/v1/category.controller')

const {
     authenticateUser,
    authorizPermissions
} = require('../middleware/authentication');

router.route('/')
      .get(GetAllCategory)
      .post([authenticateUser, authorizPermissions('admin')], CreateCategory)

router.route('/group').post([authenticateUser, authorizPermissions('admin')], CreateCategoryGroup)


module.exports = router