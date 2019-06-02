const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Models
const User = require('../models/user');


/* GET users listing. */
router.post('/register', function(req, res, next) {
  const {username, password} = req.body;

  bcrypt.hash(password,10).then((hash) => {
    const user = new User({
      username,
      password : hash
    });

    const promise = user.save();

    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
  });
});

router.get('/login', (req, res, next) => {
  const {username , password} = req.body;

  User.findOne({
    username
  }, (err, user) => {
    if(err)
      throw err;

    if(!user){
      res.json({
        errCode : 100,
        message : 'Authentication failed. User not found.'
      });
    }else{
      bcrypt.compare(password, user.password).then((result) => {
        if(result){
          const payload = {
            username
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
            errCode : 99,
            message : 'Authentication failed. Wrong password.'
          });
        }
      });
    }
  });
});

module.exports = router;
