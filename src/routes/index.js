const express = require('express')
const router = express.Router()
const authRouter = require('../routes/auth.routes')
const productRouter = require('../routes/product.routes')
const categoryRouter = require('../routes/category.routes')
const brandRouter = require('../routes/brand.routes')

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)
router.use('/brand', brandRouter)

module.exports = router