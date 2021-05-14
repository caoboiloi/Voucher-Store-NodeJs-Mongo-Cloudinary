var express = require('express');
var router = express.Router();
const {authenticateTokenAdmin} = require('../../config/token')
const Voucher = require('../../models/voucher')
const User = require('../../models/user')
const Buy = require('../../models/buy')

const moment = require('moment')

router.get('/', authenticateTokenAdmin, async (req, res, next) => {
    try {
        var vouchers_count = await Voucher.countDocuments()
        var not_valid_buy = await Buy.countDocuments({validation: false, 'cancel.check': false})
        var valid_buy = await Buy.countDocuments({validation: true, 'receive.check': true})
        var sum_price = await Buy.aggregate([
            { $match: { validation: true, 'receive.check': true } },
            { $group: { _id: null , totalPrice: { $sum: "$totalPrice" }}}
        ])
    
        var buys_not_valid = await Buy.find({validation: false, 'cancel.check': false}).sort({totalPrice: 'desc'}).limit(15)
        var buys_cancel = await Buy.find({'cancel.check': true}).sort({totalPrice: 'desc'}).limit(15)
        var revenues = await Buy.find({validation: true, 'receive.check': true}).sort({totalPrice: 'desc'}).limit(15)
        var buys_receive = await Buy.find({validation: true, 'receive.check': false}).sort({totalPrice: 'desc'}).limit(15)
    
        var users = await User.find({type: 'Admin'}).select("_id name salary phone")
        res.render('admin/dashboard', {
            title: "Bảng điều khiển",
            name_title: 'dashboard',
            sum_price : sum_price[0].totalPrice,
            valid_buy,
            not_valid_buy,
            vouchers_count,
            users,
            buys_not_valid,
            buys_cancel,
            revenues,
            buys_receive,
            moment
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