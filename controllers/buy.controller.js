const Buy = require('../models/buy')
const User = require('../models/user')
const Cart = require('../models/cart')

const {validationResult} = require('express-validator')

const {hash, verify} = require('../config/crypto')

async function getAllBuy(req, res, next) {
    try {
        var allBuy = await Buy.find().populate({
            path: 'shipper',
            populate: {
                path: 'item',
                select: 'name'
            }
        }).sort({date: 'desc'})
        if (allBuy.length == 0) {
            throw new Error('Xảy ra lỗi, vui lòng refresh lại trang')
        }

        return res.status(200).json({
            status: true,
            message: 'Tất cả hoá đơn thanh toán',
            Buy: allBuy
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        })
    }
}

async function addBuy(req, res, next) {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        var {
            user,
            validation,
            check,
            name,
            phone,
            email,
            cart,
            shipper,
            address,
            district,
            city,
            note,
            password
        } = req.body
        try {
            let passHashed = await hash(password)

            Date.prototype.addDays = function(days) {
                var date = new Date(this.valueOf());
                date.setDate(date.getDate() + days);
                return date;
            }
            var orderDate = new Date();

            // Kiểm tra xác thực mật khẩu
            var getUser = await User.findOne({_id: user,password : passHashed}).exec()
            if (getUser !== null) {
                var newCart = await Cart.findById(cart)
                if (newCart !== null) {
                    const query = new Buy ({
                        user,
                        validation,
                        check,
                        name,
                        totalPrice: newCart.totalPrice,
                        products: newCart.products,
                        phone,
                        email,
                        orderDate,
                        deliveryDate: orderDate.addDays(3),
                        shipper,
                        address,
                        district,
                        city,
                        note
                    })
                    var newBuy = await query.save()
                    if (newBuy !== null) {
                        var newCart = await Cart.findByIdAndUpdate(cart,{totalPrice: 0, products: []},{new: true, useFindAndModify: false})
                        if (newCart !== null || newCart !== undefined) {
                            res.status(200).json({
                                status: true,
                                message: 'Thanh toán sản phẩm thành công',
                                Buy: newBuy
                            })
                        }
                        else {
                            throw new Error(`Lỗi xảy ra, vui lòng thử lại`)
                        }
                    }
                    else {
                        throw new Error(`Lỗi xảy ra, vui lòng thử lại`)
                    }
                }
                else {
                    throw new Error(`Lỗi xảy ra, vui lòng thử lại`)
                }
            }
            else {
                throw new Error(`Xác thực mật khẩu sai, vui lòng thử lại`)
            }
        } catch (error) {
            res.status(500).json({
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
		return res.json({
			status: false,
			error: message
		})
    }

}

module.exports = {addBuy, getAllBuy}