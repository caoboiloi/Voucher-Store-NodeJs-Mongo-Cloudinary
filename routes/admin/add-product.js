var express = require('express');
var router = express.Router();

const Brand = require('../../models/brand')
const Category = require('../../models/category')

router.get('/',async (req, res, next) => {
    try {
        const brands = await Brand.find().select('_id name')
        const categories = await Category.find().select('_id name')
        res.render('admin/add-product', {
            title: "Thêm sản phẩm mới",
            name_title: 'add-product',
            brands,
            categories
        })
    } catch (error) {
        res.render('error')
    }
})

module.exports = router