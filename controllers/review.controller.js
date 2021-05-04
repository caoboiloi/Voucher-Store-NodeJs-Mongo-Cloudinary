const Review = require('../models/review')

const {validationResult} = require('express-validator')

const moment = require('moment')

async function getLimitReview(req, res, next) {
    const {page, voucher} = req.params
    let perPage = 5
    try {
        if (!page || !voucher) {
            throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
        }
        var review = await Review.find({voucher: voucher})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .sort({date: 'desc'}).exec()
        if (review.length == 0) {
            review = []
        }

        res.status(200).json({
            status: true,
            message: 'Load trang thành công',
            review: review,
        })
    } catch (error) {
        return res.json({
			status: false,
			error: error.message
		})
    }


}

async function addReview(req, res, next) {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const {voucher, email, name, star, review} = req.body
        var query = new Review({
            voucher, email, name, star, review, date: new Date()
        })
        var newReview = await query.save()

        if (newReview == undefined || newReview == null) {
            throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
        }

        res.status(200).json({
            status: true,
            message: 'Đăng review thành công',
            review: newReview
        })
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

module.exports = {addReview, getLimitReview}