const Voucher = require('../models/voucher')
// phải khai báo các model mà sử dụng population
const Brand = require('../models/brand')
const Category = require('../models/category')

const VoucherBuilder = require('../pattern/VoucherBuilder')

const fetch = require("node-fetch");

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

async function addVoucher(req, res, next) {
    cookie = req.cookies
    let result = validationResult(req)
    if (result.errors.length === 0) {
        var {price, name, brand, category, desc, expirationDate, availability, image} = req.body
        const imageUrlArray = []
        const voucher = new VoucherBuilder()
        .setName(name)
        .setPrice(price)
        .setBrand(brand)
        .setCategory(category)
        .setDescription(desc)
        .setExpirationDate(expirationDate)
        .setAvailability(availability)
        .buildInfo()
        for (var i = 0; i < image.length; i++) {
            let queryImg = {
                image : image[i],
                image_name : `${voucher._id}_${i+1}`,
                folder: `vouchers/${voucher._id}`
            }
            const url = await fetch(`${process.env.URL}/api/image-upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `connect.sid=${cookie['connect.sid']};token=${cookie.token}`
                },
                body: JSON.stringify(queryImg)
            }).then(res => res.text())
            .then(data => {
                data = JSON.parse(data)
                if (data.status) {
                    return data.result.url
                }
            }).catch(error => {
                return res.status(500).json({
                    status: false,
                    error: error.message
                })
            })
            imageUrlArray.push(url)
        }
        voucher.image = imageUrlArray
        try {
            const newVoucher = voucher.save()
            if (newVoucher == null || newVoucher == undefined) {
                throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
            }
            else {
                res.status(200).json({
                    status: true,
                    message: 'Thêm sản phẩm mới thành công',
                    Voucher: newVoucher
                })
            }
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message
            })
        }
    }
    else {
        let messages = result.mapped()
        let message = 'error - 404 not found'
        for (m in messages) {
            message = messages[m].msg
            break
        }
		return res.status(500).json({
			status: false,
			error: message
		})
    }
}

module.exports = {getAllVoucher, getLimitVoucher, addVoucher}