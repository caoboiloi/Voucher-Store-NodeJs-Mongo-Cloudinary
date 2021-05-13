const mongoose = require('mongoose')
var passportLocalMongoose = require('passport-local-mongoose');

const ContactSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    }
})

ContactSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('contacts', ContactSchema)