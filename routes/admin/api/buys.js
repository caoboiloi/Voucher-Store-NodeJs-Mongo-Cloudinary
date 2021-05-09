var express = require('express');
var router = express.Router();

const {updateValidationBuyById} = require('../../../controllers/buy.controller')

const {authenticateTokenAdmin} = require('../../../config/token')

router.put('/validation', authenticateTokenAdmin, updateValidationBuyById)

module.exports = router;