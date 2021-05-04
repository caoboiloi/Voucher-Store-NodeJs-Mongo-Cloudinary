const Voucher = require('../models/voucher')
// phải khai báo các model mà sử dụng population
const Brand = require('../models/brand')
const Category = require('../models/category')

const {validationResult} = require('express-validator')

async function getAllVoucher(req, res, next) {
    Voucher.find()
    .populate({
        path: "brand"
    })
    .populate({
        path: "category"
    })
    .then(allVoucher => {
        if (allVoucher.length !== 0) {
            return res.status(200).json({
                status: true,
                message: 'Tất cả vouchers',
                voucher: allVoucher,
            });
        }
        else {
            throw new Error('Không có product nào tồn tại trong database.')
        }
    })
    .catch((err) => {
        res.status(500).json({
            code: 500,
            status: false,
            error: err.message
        });
    });
}

async function getLimitVoucher(req, res, next) {
    try {
        var {page} = req.params
        var perPage = 9
        var vouchers = await Voucher.find()
        .skip((perPage * page) - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .populate({
            path: "brand"
        })
        .populate({
            path: "category"
        }).exec()
        
        if (vouchers.length == 0) {
            throw new Error('Lỗi xảy ra, vui lòng thử lại')
        }
        res.status(200).json({
            status: true,
            vouchers: vouchers,
            message:'Load trang mới thành công'
        })
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: false,
            error: err.message
        });
    }
}

module.exports = {getAllVoucher, getLimitVoucher}