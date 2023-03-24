const CustomAPIError = require('./custom_api')
const status = require('http-status-codes')

export class Unauthorizederror extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = status.StatusCodes.FORBIDDEN
    }
};