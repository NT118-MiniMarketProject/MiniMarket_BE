const express = require('express')
const router = express.Router()
const authRouter = require('./auth.routes')
const productRouter = require('./product.routes')
const categoryRouter = require('./category.routes')
const brandRouter = require('./brand.routes')
const userRouter = require('./user.routes')
const ReviewRouter = require('./review.routes')
const salesRouter = require('./sale.routes')

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)
router.use('/brand', brandRouter)
router.use('/user', userRouter)
router.use('/reviews', ReviewRouter)
router.use('/sales', salesRouter)

module.exports = router