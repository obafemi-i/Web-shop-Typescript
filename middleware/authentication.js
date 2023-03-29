const customError = require('../errors')
const {isTokenValid} = require('../utils')

const authenticateUser = async (req,res,next) =>{
    // console.log(req.signedCookies);
    const token = req.signedCookies.token

    if (!token) {
        throw new customError.UnauthenticatedError( 'Authentication failed, no token.')
    }

    try {
        const { name, userId, role} = isTokenValid({ token })
        req.user = ( name, userId, role )
        // console.log(req.user.name);
        next()
    } catch (error) {
        throw new customError.UnauthenticatedError('Authentication failed')
    }
};

const authorizePermissions = (...roles) =>{
    return (req,res,next) =>{
        // console.log(`current user be: ${req.user}`);
        if(!roles.includes(req.user)) {
                    throw new customError.Unauthorizederror('Unauthorized to access this route')
                }
            next()
    }
};

module.exports = {authenticateUser, authorizePermissions}