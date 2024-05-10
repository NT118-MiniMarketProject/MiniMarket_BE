const {
    registerValidate,
    loginValidate
} = require('./validation')

const {modifyCategoryByGroup} = require('./modifiedCategoryRes')
const queryProduct = require('./RequestQueryProduct')


module.exports = {
    registerValidate,
    loginValidate,
    modifyCategoryByGroup,
    queryProduct
}