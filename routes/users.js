const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Models
const User = require('../models/user');


/* GET users listing. */
router.post('/register', function(req, res, next) {
  const {firstname, lastname, phonenumber, email, password} = req.body;

  const ModifiedAt = Date.now();

  bcrypt.hash(password,10).then((hash) => {
    const user = new User({
      firstname,
      lastname,
      phonenumber,
      email,
      ModifiedAt,
      password : hash
    });

    const promise = user.save();

    promise.then((data) => {
      res.json({
        firstname : data.firstname,
        lastname: data.lastname,
        phonenumber: data.phonenumber,
        email: data.email,
        message: 'Successfully created user.'
      });
    }).catch((err) => {
      res.json(err);
    });
  });
});

router.get('/login', (req, res, next) => {
  const {email , password} = req.body;

  User.findOne({
    email
  }, (err, user) => {
    if(err)
      throw err;

    if(!user){
      res.json({
        code : req.app.get('ERRORS').USER_NOT_FOUND,
        message : 'Authentication failed. User not found.'
      });
    }else{
      bcrypt.compare(password, user.password).then((result) => {
        if(result){
          const payload = {
            firstname : user.firstname,
            lastname: user.lastname,
            phonenumber: user.phonenumber,
            email: user.email,
          };

          const token = jwt.sign(payload, req.app.get('jwt_secret_key'),{
            expiresIn : 720 //12 saat - dakika cinsinden
          });

          res.json({
            message : 'Succesfully login.',
            token: token
          });
        }else{
          res.json({
            code : req.app.get('ERRORS').WRONG_PASSWORD,
            message : 'Authentication failed. Wrong password.'
          });
        }
      });
    }
  });
});


router.delete('/:user_id', function (req, res, next) {
  const promise = User.findByIdAndRemove(req.params.user_id);

  promise.then((user) => {
    if(!user){
      next({
        code : req.app.get('ERRORS').USER_NOT_FOUND,
        message: 'User not found.'
      });
    }else{
      res.json(user);
    }
  }).catch((err) => {
    res.json(err);
  });

});
module.exports = router;
