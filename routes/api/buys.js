var express = require('express');
var router = express.Router();

var {addBuy, getAllBuy} = require('../../controllers/buy.controller')

const buyValidator = require('../../validators/buyValidator')

const {authenticateToken} = require('../../config/token')

router.get('/', authenticateToken, getAllBuy)
router.post('/', authenticateToken, buyValidator, addBuy)

module.exports = router;