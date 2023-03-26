const User = require('../models/user')
const status = require('http-status-codes')
const customErrors = require('../errors')
const tokenize = require('../utils')

const register = async (req,res) =>{
    const {email, name, password} = req.body

    const emailAlreadyExists = await User.findOne({ email })
    if (emailAlreadyExists) {
        throw new customErrors.BadRequestError('Email already exists')
    }

    // first registered user is admin
    const isFirstAccount = (await User.countDocuments({})) === 0
    const role = isFirstAccount ? 'admin' : 'user'

    const user = await User.create({ name, email, password, role})

    const tokenUser = tokenize.createTokenUser(user)
    tokenize.attachCookiesToResponse({ res, user:tokenUser })

    res.status(status.StatusCodes.CREATED).json({ user: tokenUser})
};


const login = async (req,res) =>{
    const {email, password} = req.body
    if (!email || !password) {
        throw new customErrors.BadRequestError('Please provide all values')
    }

    const user  = await User.findOne({ email })
    if (!user) {
        throw new customErrors.BadRequestError(`No user with this email: ${email}`)
    }

    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new customErrors.UnauthenticatedError('Wrong password. Try again.')
    }

    const tokenUser = tokenize.createTokenUser(user)
    tokenize.attachCookiesToResponse({ res, user:tokenUser })

    res.status(status.StatusCodes.OK).json({ user: tokenUser})
};


const logout = async (req,res) =>{
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now() + 1000)
    })
    res.status(status.StatusCodes.OK).json({ msg: 'User logged out'})
};

module.exports = {
    register,
    login,
    logout
};