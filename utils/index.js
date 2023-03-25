module.exports.checkPermission = require('./check_permissions');
module.exports.createTokenUser = require('./create_token_user');
const { createjwt, isTokenValid, attachCookiesToResponse } = require('./jwt');

module.exports = {
    createjwt,
    isTokenValid,
    attachCookiesToResponse
}