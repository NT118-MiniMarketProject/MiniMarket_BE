const { StatusCodes } = require('http-status-codes')
const CustomAPIError = require('./custom-api')

class NotEnoughError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.CONFLICT
  }
}

module.exports = NotEnoughError