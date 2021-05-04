var express = require('express');
var router = express.Router();

const {getAllCart, addCart, deleteOneCart, updateQuantityItem, getCartById} = require('../../controllers/cart.controller')

const cartValidator = require('../../validators/cartValidator')

const {authenticateToken} = require('../../config/token')

router.get('/', authenticateToken, getAllCart)

router.get('/:id',authenticateToken, getCartById)


router.post('/', authenticateToken, cartValidator, addCart)

router.delete('/', authenticateToken, deleteOneCart)

router.put('/quantity', authenticateToken, updateQuantityItem)

module.exports = router;