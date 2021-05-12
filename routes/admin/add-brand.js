var express = require('express');
var router = express.Router();

const City = require('../../models/city')

router.get('/',async (req, res, next) => {
    try {
        var cities = await City.find().select('_id name')

        if (cities.length == 0) {
            throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
        }

        res.render('admin/add-brand', {
            title: 'Thêm thương hiệu mới',
            name_title: 'add-brand',
            cities
        })
    
    } catch (error) {
        res.render('error')
    }
})

module.exports = router