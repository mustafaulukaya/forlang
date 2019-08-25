const mongoose = require('mongoose');
const  Schema = mongoose.Schema;


const ForgotPasswordSchema = new Schema({
    Email:{
        type: String,
        required: true
    },
    Code: {
        type : String,
        minlength: 8,
        required: true
    },
    LastDate: {
        type: Date
    }
});

module.exports = mongoose.model('ForgotPassword',ForgotPasswordSchema);