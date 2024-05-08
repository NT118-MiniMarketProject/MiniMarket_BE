const express = require('express');
const router = express.Router();
const {
    GetAllCategory,
    CreateCategory,
    CreateCategoryGroup,
    GetAllCategoryGroups,
    GetCategoryByCategoryGroupAll,
    GetCategoryGroupById
} = require('../controllers/category.controller')

const {
     authenticateUser,
    authorizePermissions
} = require('../middleware/authentication');

router.route('/')
      .get(GetAllCategory)
      .post([authenticateUser, authorizePermissions('admin')], CreateCategory)

router.route('/group')
      .post([authenticateUser, authorizePermissions('admin')], CreateCategoryGroup)
      .get(GetAllCategoryGroups)

router.get('/group/all', GetCategoryByCategoryGroupAll);
router.get('/group/:id', GetCategoryGroupById);


module.exports = router