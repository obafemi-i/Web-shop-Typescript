const CustomAPIError = require('./custom_api')
const status = require('http-status-codes')

class Unauthorizederror extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = status.StatusCodes.FORBIDDEN
    }
};

module.exports = Unauthorizederror