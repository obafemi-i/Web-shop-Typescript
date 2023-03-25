const status = require('http-status-codes')
const CustomAPIError = require('./custom_api')


class UnauthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = status.StatusCodes.UNAUTHORIZED
    }
};

module.exports = UnauthenticatedError