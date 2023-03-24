const customError = require('../errors')
const {isTokenValid} = require('../utils')

export const authenticateUser = async (req,res,next) =>{
    const token = req.signedCookies.token
    console.log(req.signedCookies);

    if (!token) {
        throw new customError.UnauthenticatedError( 'Authentication failed.')
    }

    try {
        const { name, userId, role} = isTokenValid({ token })
        req.user = ( name, userId, role )
        next()
    } catch (error) {
        throw new customError.UnauthenticatedError('Authentication failed')
    }
};

export const authorizePermissions = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)) {
            throw new customError.Unauthorizederror('Unauthorized to access this route')
        }
        next()
    }
};