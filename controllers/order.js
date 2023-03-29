const Order = require('../models/order')
const Product = require('../models/product')

const customError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const {checkPermission} = require('../utils')

const fakeStripeAPI = async ({amount, currency}) =>{
    const clientSecret = 'somerandomvalue'
    return {clientSecret, amount}
};

const createOrder = async (req,res) =>{
    const {items: cartItems, tax, shippingFee} = req.body

    console.log(cartItems);

    if (!cartItems || cartItems < 1) {
        throw new customError.BadRequestError('No items in cart')
    }

    if (!tax || !shippingFee) {
        throw new customError.BadRequestError('Please provide tax and shipping fee')
    }

    let orderItems = []
    let subtotal = 0

    for (const item of cartItems) {
        const dbProduct = await Product.findOne({_id: item.product})
        if(!dbProduct) {
            throw new customError.BadRequestError('No product with such id')
        }

        const {name, price, image, _id} = dbProduct
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        }
        // add item to order
        orderItems = [...orderItems, singleOrderItem]

        // calculate subtotal
        subtotal += item.amount * price
    }

    // calculate total
    const total = tax + shippingFee + subtotal

    // get client's secret
    const paymentIntent = await fakeStripeAPI({
        amount: total,
        currency: 'usd'
    })

    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.clientSecret,
        user: req.user.userId
    })

    res.status(StatusCodes.CREATED).json({order, clientSecret: order.clientSecret})
};

const getAllOrder = async (req,res)=>{
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders, count:orders.length})
}

const getSingleOrder = async (req,res) =>{
    const {id: orderId} = req.params
    const order = await Order.findOne({_id: orderId})

    if (!order) {
        throw new customError.NotFoundError(`No order with id: ${orderId}`)
    }

    checkPermission(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
};