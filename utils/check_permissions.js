const CustomError = require('../errors')

export const checkPermission = (requestUser, resourceUserId) =>{
    if (requestUser.role === 'admin') return
    if (requestUser.userId === resourceUserId.toString()) return
    throw new CustomError.UnauthenticatedError(
        'Not authorized to access this route'
    )
};