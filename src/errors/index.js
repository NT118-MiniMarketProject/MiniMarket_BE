const CustomAPIError = require('./custom-api')
const NotFoundError = require('./not-found')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')
const UnauthorizedError = require('./unauthorized')
const NotEnoughError = require('./Not-enough')

module.exports = {
    CustomAPIError,
    NotFoundError,
    BadRequestError,
    UnauthenticatedError,
    UnauthorizedError,
    NotEnoughError
}