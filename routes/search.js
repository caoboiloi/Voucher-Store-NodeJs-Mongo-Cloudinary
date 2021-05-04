var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var {brands, categories} = req.vars
    var {footer} = req.footer
    res.render('search', {user: req.user, vouchers: [] , categories: categories, brands: brands, footer})
});

module.exports = router;