const mongoose = require('mongoose');
const  Schema = mongoose.Schema;


const UserSchema = new Schema({
    firstname : {
        type : String,
        minlength: 2,
    },
    lastname: {
        type : String,
        minlength: 2,
    },
    phonenumber:{
      type: String,
      required: true
    },
    email: {
        type : String,
        minlength: 1,
        required: true,
        unique: true
    },
    password: {
        type : String,
        minlength: 8
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    ModifiedAt: {
        type: Date,
        default: Date.now
    },
    status:{
        type: Number,
        default: 0
    }
});

/*
* status =>
*           0 -> Not Confirmed
*           1 -> Active
*
* */

module.exports = mongoose.model('user',UserSchema);