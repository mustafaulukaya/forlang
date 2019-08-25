const mongoose = require('mongoose');
const  Schema = mongoose.Schema;


const UserSchema = new Schema({
    Name : {
        type : String,
        minlength: 2,
        required: true
    },
    Surname: {
        type : String,
        minlength: 2,
        required: true
    },
    Email:{
      type: String,
      required: true
    },
    Password: {
        type : String,
        minlength: 8,
        required: true,
        unique: true
    },
    UserType: {
        type: Number,
        default: 2 // 0 system admin | 1 teacher | 2 student | 3 teacher&student
    },
    TakenLessons: [],
    GivenLessons: [],
    StatusID: {
        type: Number,
        default: 1 // 1 active | 0 passive | 2 deleted
    },
    CreatedAt:{
        type: Date,
        default: Date.now

    },
    ModifiedAt:{
        type: Date,
        default: Date.now

    }
});

/*
* status =>
*           0 -> Not Confirmed
*           1 -> Active
*
* */

module.exports = mongoose.model('user',UserSchema);