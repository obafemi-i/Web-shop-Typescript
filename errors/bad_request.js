const status = require('http-status-codes')
const CustomAPIError = require('./custom_api')


export class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = status.StatusCodes.BAD_REQUEST
    }
};