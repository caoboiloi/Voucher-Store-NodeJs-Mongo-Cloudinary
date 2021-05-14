var express = require('express');
var router = express.Router();
const {authenticateTokenAdmin} = require('../../config/token')

const moment = require('moment')

const Buy = require('../../models/buy')
const User = require('../../models/user')

router.get('/', authenticateTokenAdmin, async (req, res, next) => {
    try {

        var buys = await Buy.find().populate({
            path:'shipper',
            populate: {
                path: 'item',
                select: 'name'
            }
        })
        .populate('user')
        .exec()

        var users = await User.find({type: 'Customer'})

        res.render('admin/table', {
            title: "Danh sách dữ liệu",
            name_title: 'table',
            moment,
            buys,
            users
        })
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: false,
            error: error.message
        })
    }

})

module.exports = router