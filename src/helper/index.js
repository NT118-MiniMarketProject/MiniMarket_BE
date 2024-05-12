const {
    registerValidate,
    loginValidate
} = require('./validation')

const {modifyCategoryByGroup} = require('./modifiedCategoryRes')
const queryProduct = require('./RequestQueryProduct')
const CustomResponse = require('./CustomResponse')


module.exports = {
    registerValidate,
    loginValidate,
    modifyCategoryByGroup,
    queryProduct,
    CustomResponse
}