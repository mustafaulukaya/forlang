const express = require('express');
const router = express.Router();

const UserOperations = require('../../Data/API/Visa/UserOperations');

//Models
const User = require('../../Data/Models/Visa/user');

//DELETE user
router.delete('/:user_id', function (req, res, next) {
    const promise2 = User.findById(req.params.user_id);

    promise2.then((user) => {
        user.StatusID = 0;

        const promise = User.findByIdAndUpdate(
            req.params.user_id,
            user,
            {
                new : true
            }
        );
    });

    promise.then((user) => {
        if(!user){
            next({
                code : req.app.get('ERRORS').USER_NOT_FOUND,
                message: 'User not found.'
            });
        }else{
            const user = new DeletedUser({
                firstname: user.firstname,
                lastname: user.lastname,
                phonenumber: user.phonenumber,
                email: user.email,
                password : user.password
            });

            const promise = user.save();
            res.json(user);
        }
    }).catch((err) => {
        res.json(err);
    });
});

//GET user information
router.get('/info', (req, res, next) => {
    const promise = UserOperations.GetInformation(req.decode.ID);

    promise.then((err,user) => {
        if(err){
            next({message :'Unexpected Error.', code : req.app.get('ERRORS').INTERNAL_SERVER_ERROR});
        }else{
            if(user){
                res.json(user);
            }
            else{
                next({message :'User not found.', code : req.app.get('ERRORS').USER_NOT_FOUND});
            }
        }
    });
});

module.exports = router;