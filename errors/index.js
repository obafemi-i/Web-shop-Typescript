const CustomAPIError = require('./custom_api');
const UnauthenticatedError = require('./unauthenticated');
const BadRequestError = require('./bad_request');
const NotFoundError = require('./not_found');
const Unauthorizederror = require('./unauthorized');

 module.exports = {
    CustomAPIError,
    UnauthenticatedError,
    BadRequestError,
    NotFoundError,
    Unauthorizederror
 }