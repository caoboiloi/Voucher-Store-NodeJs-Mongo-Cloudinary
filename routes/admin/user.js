var express = require('express');
var router = express.Router();
const {authenticateTokenAdmin} = require('../../config/token')
const User = require('../../models/user')

router.get('/', authenticateTokenAdmin, async (req, res, next) => {
    res.render('admin/user', {
        user: req.user,
        title: 'Thông tin quản trị',
        name_title: 'user',
    })
})

module.exports = router