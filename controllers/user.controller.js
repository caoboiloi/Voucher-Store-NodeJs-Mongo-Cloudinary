const User = require('../models/user')

const {validationResult} = require('express-validator')

const {hash, verify} = require('../config/crypto')

async function updateUserId(req, res, next) {
    let result = validationResult(req)
    if (result.errors.length === 0) {
        const id = req.params.id
        const {name, email, phone, url, street, city, district, code, desc, password} = req.body
        const user = {
            name,
            email,
            city,
            district,
            code,
            phone,
            street,
            url,
            desc
        }
        let passHashed = await hash(password)

        User.findOneAndUpdate({_id: id, password : passHashed}, user, {new: true, useFindAndModify: false})
        .then(newUser => {
            if (newUser !== null) {
                res.status(200).json({
                    status:true,
                    message:`Cập nhật người dùng thành công`,
                    user: newUser
                })
            }
            else {
                throw new Error(`Xác thực mật khẩu sai`)
            }
        }).catch(e => {
            res.status(500).json({
                status:false,
                error: e.message
            })
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

module.exports = {updateUserId}