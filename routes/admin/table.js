var express = require('express');
var router = express.Router();
const {authenticateTokenAdmin} = require('../../config/token')

const moment = require('moment')

const Buy = require('../../models/buy')

router.get('/',async (req, res, next) => {
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
        res.render('admin/table', {
            title: "Danh sách dữ liệu",
            moment,
            buys
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