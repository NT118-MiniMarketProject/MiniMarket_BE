const {StatusCodes} = require('http-status-codes')
const CustomAPIError = require('./custom-api')

export class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.StatusCodes = StatusCodes.NOT_FOUND
    }
}