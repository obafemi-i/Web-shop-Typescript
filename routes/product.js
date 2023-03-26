const express = require('express')
const router = express.Router()

const {createProduct, getAllProducts, getSingleProduct, updateProduct, uploadImage, deleteProduct} = require('../controllers/product')
const auth = require('../middleware/authentication')

router.route('/').post([auth.authenticateUser, auth.authorizePermissions('admin')], createProduct).get(getAllProducts)
router.route('/uploadImage').post([auth.authenticateUser, auth.authorizePermissions('admin')], uploadImage)
router.route('/:id').get(getSingleProduct).patch([auth.authenticateUser, auth.authorizePermissions('admin')], updateProduct).delete([auth.authenticateUser,auth.authorizePermissions('admin')], deleteProduct)

// router.route('/:id/reviews').get(get)

module.exports = router;