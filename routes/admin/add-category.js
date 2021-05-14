var express = require('express');
var router = express.Router();

const Group = require('../../models/group')

const {authenticateTokenAdmin} = require('../../config/token')

router.get('/', authenticateTokenAdmin, async (req, res, next) => {
    try {
        const groups = await Group.find()

        if (groups.length == 0) {
            throw new Error('Lỗi xảy ra, vui lòng refresh lại trang')
        }

        res.render('admin/add-category', {
            title: 'Thêm nhóm phân loại mới',
            name_title: 'add-category',
            groups
        })
    } catch (error) {
        res.render('error')
    }
})

module.exports = router