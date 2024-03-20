const {StatusCodes} = require('http-status-codes')
const CustomAPIError = require('./custom-api')

export class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.StatusCodes = StatusCodes.UNAUTHORIZED
    }
}