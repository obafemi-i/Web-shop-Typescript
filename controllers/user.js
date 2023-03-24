const User = require('../models/user')
const status = require('http-status-codes')
const customError = require('../errors')
const tokenize = require('../utils')

export const getAllUsers = async (req,res)=>{
    console.log(req.user);
    const users = await User.find({role: 'user'}).select('-password')
    res.status(status.StatusCodes.OK).json({ users })
};

export const getSingleUser = async(req,res)=>{
    const user = await User.findOne({ _id:req.params.id }).select('-password')
    if (!user){
        throw new customError.NotFoundError(`No user with id: ${req.params.id}`)
    }
    tokenize.checkPermission(req.user, user._id)
    res.status(status.StatusCodes.OK). json({user})
};

export const showCurrentUser = async(req, res)=>{
    res.status(status.StatusCodes.OK).json({ user: req.user})
};

export const updateUser = async(req,res)=>{
    const { email, name } = req.body
    if (! email || ! name){
        throw new customError.BadRequestError(`Please provide all values`)
    }
    const user = await User.findOne({_id: req.user.userId})

    user.email = email
    user.name = name

    await user.save()

    const tokenUser = tokenize.createTokenUser(user)
    tokenize.attachCookiesToResponse({ res, user:tokenUser})
    res.status(status.StatusCodes.OK).json({ user: tokenUser})
};

export const updateUserPassword = async(req, res)=>{
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || newPassword){
        throw new customError.BadRequestError('Please provide both values')
    }

    const user = await User.findOne({ _id: req.user.Id})

    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if (!isPasswordCorrect) {
        throw new customError.UnauthenticatedError('Wrong password, try again.')
    }
    user.password = newPassword
    await user.save()

    res.status(status.StatusCodes.OK).json({ msg: 'Password successfully updated!'})
};