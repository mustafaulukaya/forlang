const mongoose = require('mongoose');
const  Schema = mongoose.Schema;


const DeletedUserSchema = new Schema({
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
    status:{
        type: Number,
        default: 2
    }
});

/*
* status =>
*           0 -> Not Confirmed
*           1 -> Active
*           2 -> Deleted
* */

module.exports = mongoose.model('deleteduser',DeletedUserSchema);