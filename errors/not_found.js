const status = require('http-status-codes')
const CustomAPIError = require('./custom_api')

class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = status.StatusCodes.NOT_FOUND
    }
};

module.exports = NotFoundError