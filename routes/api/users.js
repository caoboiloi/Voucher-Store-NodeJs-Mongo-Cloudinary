var express = require('express');
var router = express.Router();

const {authenticateToken} = require('../../config/token')

const {updateUserId} = require('../../controllers/user.controller')

const userValidator = require('../../validators/userValidator')


router.put('/:id', authenticateToken, userValidator, updateUserId)

module.exports = router;