const Product = require('../models/products')
const status = require('http-status-codes')
const customError = require('../errors')
const path = require('path')

const createProduct = async (req,res) =>{
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(status.StatusCodes.CREATED).json({ product })
};

const getAllProducts = async (req,res) =>{
    const products = await Product.find({})
    res.status(status.StatusCodes.OK).json({ products, count: products.length })
};

const getSingleProduct = async (req,res) =>{
    const { id: productId } = req.params
    const product = await Product.findOne({ _id: productId}).populate('reviews')

    if (!product) {
        throw new customError.NotFoundError(`No product with id ${productId}`)
    }
    res.status(status.StatusCodes.OK).json({ product })
};

const updateProduct = async (req,res) =>{
    const {id: productId} = req.params
    const product = await Product.findOneAndUpdate({ _id: productId}, req.body, {
        new: true,
        runValidators: true
    })

    if(!product) {
        throw new customError.NotFoundError(`No product with id: ${productId}`)
    }
    res.status(status.StatusCodes.OK).json({ product })
};

const deleteProduct = async (req,res) =>{
    const {id: productId} = req.params
    const product = await Product.findOne({_id: productId})

    if (!product) {
        throw new customError.NotFoundError(`No such product with id: ${productId}`)
    }

    await product.remove()

    res.status(status.StatusCodes.OK).json({ msg: 'Product successfully deleted.'})
};

const uploadImage = async (req,res) =>{
    if (!req.files) {
        throw new customError.BadRequestError('No file uploaded')
    }

    const productImage = req.files.image

    if (!productImage) {
        throw new customError.BadRequestError('Please upload image')
    }

    const maxSize = 1024 * 1024

    if (productImage.size > maxSize) {
        throw new customError.BadRequestError('Please upload image smaller than 1MB')
    }

    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`)

    await productImage.mv(imagePath)
    res.status(status.StatusCodes.OK).json({ image: `/uploads/${productImage.name}`})
};

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
};