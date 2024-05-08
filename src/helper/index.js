const {
    registerValidate,
    loginValidate
} = require('./validation')

const {modifyCategoryByGroup} = require('./modifiedCategoryRes')


module.exports = {
    registerValidate,
    loginValidate,
    modifyCategoryByGroup
}