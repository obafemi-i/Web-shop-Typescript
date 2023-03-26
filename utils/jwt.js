const jswt = require('jsonwebtoken')

const createjwt = ({payload})=>{
    const token = jswt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
    return token
};

const isTokenValid = ({token})=> jswt.verify(token, process.env.JWT_SECRET)

const attachCookiesToResponse = ({res, user})=>{
    const token = createjwt({payload:user})
    const oneDay = 1000 * 60 * 60 * 24
    
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true
    })
};

module.exports = {createjwt, isTokenValid, attachCookiesToResponse};