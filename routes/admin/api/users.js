var express = require('express');
var router = express.Router();

var userValidator = require('../../../validators/userValidator')
var {updateUserId} = require('../../../controllers/user.controller')

router.put('/:id', userValidator, updateUserId)

module.exports = router