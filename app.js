require('dotenv').config()
require('express-async-error')

const express = require('express');
const app = express();


const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')

const Router = require('./src/routes/index')

//middleware
const notFoundMiddleware = require('./src/middleware/not-found')
const errorHandlerMiddleware = require('./src/middleware/error-handler')

app.set('trust proxy', 1)
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100 }))

//extra packages
app.use(helmet())
app.use(cors())
app.use(xss())

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(fileUpload({ useTempFiles: true }))

// app.get('/', (req, res) => {
//   res.send('e-commerce api')
// })

app.use('/api/v1', Router)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`listening on port ${port}` );
        })
    } catch (err) {
        console.log(err)
    }
}
start()