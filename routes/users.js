const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Models
const User = require('../models/Visa/user');
const DeletedUser = require('../models/Visa/deleteduser');


/* POST user register. */
router.post('/register', function(req, res, next) {
  const {firstname, lastname, phonenumber, email, password} = req.body;

  const ModifiedAt = Date.now();

  bcrypt.hash(password,10).then((hash) => {
    const user = new User({
      firstname,
      lastname,
      phonenumber,
      email,
      password : hash
    });

    const promise = user.save();

    promise.then((data) => {
      res.json({
        id: data._id,
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

/* POST user login. */
router.post('/login', (req, res, next) => {
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

//DELETE user
router.delete('/:user_id', function (req, res, next) {
  const promise = User.findByIdAndRemove(req.params.user_id);

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
router.get('/:user_id', (req, res, next) => {
  const promise = User.findById(req.params.user_id);

  promise.then((err,user) => {
    if(err){
      next({message :'User not found.', code : req.app.get('ERRORS').USER_NOT_FOUND});
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