var express = require('express');
var router = express.Router();

var {addCategoryAndUpdateIntoGroup} = require('../../../controllers/category.controller')

var categoryValidator = require('../../../validators/categoryValidator')

router.post('/', categoryValidator, addCategoryAndUpdateIntoGroup)

module.exports = router