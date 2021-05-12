var express = require('express');
var router = express.Router();

const {addVoucher} = require('../../../controllers/voucher.controller')

const voucherValidator = require('../../../validators/voucherValidator')

const {authenticateTokenAdmin} = require('../../../config/token')

router.post('/', voucherValidator, addVoucher)

module.exports = router;