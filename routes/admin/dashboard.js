var express = require('express');
var router = express.Router();
const {authenticateTokenAdmin} = require('../../config/token')
const Voucher = require('../../models/voucher')
const User = require('../../models/user')
const Buy = require('../../models/buy')

router.get('/', authenticateTokenAdmin, async (req, res, next) => {
    try {
        var vouchers_count = await Voucher.countDocuments()
        var not_valid_buy = await Buy.countDocuments({validation: false})
        var valid_buy = await Buy.countDocuments({validation: true})
        var sum_price = await Buy.aggregate([
            { $group: { _id: null, totalPrice: { $sum: "$totalPrice" }}}
        ])
    
        var buys_not_valid = await Buy.find({validation: false}).sort({totalPrice: 'desc'}).limit(5)
        var products = await Voucher.find().sort({price: 'desc'}).limit(5)
        var revenues = await Buy.find({validation: true}).sort({totalPrice: 'desc'}).limit(5)
    
        var users = await User.find({type: 'Admin'}).select("_id name salary phone")
        res.render('admin/dashboard', {
            title: "Bảng điều khiển",
            sum_price : sum_price[0].totalPrice,
            valid_buy,
            not_valid_buy,
            vouchers_count,
            users,
            buys_not_valid,
            products,
            revenues
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