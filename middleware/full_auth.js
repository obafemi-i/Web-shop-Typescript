const customError = require('../errors')
const tokenize = require('../utils')

const authenticateUser = async (req, res, next) =>{
    let token;

    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer')) {
        token = authHeader.split(' ')[1]
    }
    else if (req.cookies.token) {
        token = req.cookies.token
    }

    if (!token) {
        throw new customError.UnauthenticatedError('Invalid authentication')
    }
    try {
        const payload = tokenize.isTokenValid(token)
        req.user = {
            userId: payload.user.userId,
            role: payload.useeer.role
        }
        next();
    } catch (error) {
        throw new customError.UnauthenticatedError('Invalid authentication')
    };
};

const authorizeRole = (...roles) =>{
    return (req, res, next) =>{
        if (!roles.includes(req.user.role)) {
            throw new customError.Unauthorizederror('Unauthorized to access this route')
        }
        next()
    }
};

module.exports = {authenticateUser, authorizeRole}