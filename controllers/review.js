const Review = require('../models/review')
const Product = require('../models/product')

const status = require('http-status-codes')
const customError = require('../errors')
const {checkPermission} = require('../utils')

const createReview = async (req,res) =>{
    console.log(req.body);
    const {product: productId} = req.body
    const isValidProduct = await Product.findOne({_id: productId })

    if (!isValidProduct) {
        throw new customError.NotFoundError(`No product with id: ${productId}`)
    }

    const alreadySubmitted = await Review.findOne({
        product: productId,
        user: req.user.userId
    })

    if (alreadySubmitted) {
        throw new customError.BadRequestError('Already submitted review for this product')
    }

    req.body.user = req.useer.userId
    const review = Review.create(req.body)

    res.status(status.StatusCodes.CREATED).json({ review })
};

const getAllReviews = async (req,res)=>{
    const reviews = await Review.find({}).populate({
        path: 'product',
        select: 'name company price'
    })

    res.status(status.StatusCodes.OK).json({ reviews, count: reviews.length})
};

const getSingleReview = async (req,res)=>{
    console.log(re.params);
    const {id: reviewId} = req.params

    const review = await Review.findOne({_id: reviewId})

    if (!review) {
        throw new customError.NotFoundError(`No review with id: ${reviewId}`)
    }

    res.status(status.StatusCodes.OK).json({ review })
};

const updateReview = async (req,res)=>{
    const {id: reviewId} = req.params
    const {rating, title, comment} = req.body

    const review = await Review.findOne({_id: reviewId})

    if (!review) {
        throw new customError.NotFoundError(`No review with id: ${reviewId}`)
    }

    checkPermission(req.user, review.user)

    review.rating = rating
    review.title = title
    review.comment = comment

    await review.save()
    
    res.status(status.StatusCodes.OK).json({ review })
};

const deleteReview = async (req,res) =>{
    const {id: reviewId} = req.params
    
    const review = await Review.findOne({_id: reviewId})

    if (!review) {
        throw new customError.NotFoundError(`No review with id: ${reviewId}`)
    }

    checkPermission(req.user, review.user)
    await review.remove()
    
    res.status(status.StatusCodes.OK).json({ msg: 'Succesfully deleted'})
};

const getSingleProductReviews = async (req,res)=>{
    const {id: productId} = req.params
    const reviews = await Review.find({product: productId})
    
    res.status(status.StatusCodes.OK).json({ reviews, count: reviews.length})
};


module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    getSingleProductReviews,
    updateReview,
    deleteReview
};