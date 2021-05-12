var express = require('express');
var router = express.Router();

var {addBrandAndUpdateIntoCity} = require('../../../controllers/brand.controller')

var brandValidator = require('../../../validators/brandValidator')

router.post('/', brandValidator, addBrandAndUpdateIntoCity)

module.exports = router