var express = require('express');
var router = express.Router();

const Voucher = require('../../models/voucher')

const moment = require('moment')

router.get('/', async (req, res, next) => {
    try {
        const vouchers = await Voucher.find().populate("brand").populate('category')
        res.render('admin/vouchers', {
            title: 'Thông tin sản phẩm',
            name_title: 'vouchers',
            vouchers,
            moment
        })
    } catch (error) {
        res.render('error')
    }
})

module.exports = router