const express = require('express');
const router = express.Router();

const UserOperations = require('../../Data/API/Visa/UserOperations');

//Models
const User = require('../../Data/Models/Visa/user');


/* POST user register. */
router.post('/register', function(req, res, next) {
  const {Name, Surname, Email, Password} = req.body;

  const promise = UserOperations.Save(Name, Surname, Email, Password);

  promise.then((data) => {
    res.json({
      id: data._id,
      Name : data.Name,
      Surname: data.Surname,
      Email: data.Email,
      message: 'Successfully created user.'
    });
  }).catch((err) => {
    res.json(err);
  });
});

/* POST user login. */
router.post('/login', (req, res, next) => {
  const {Email , Password} = req.body;

  User.findOne({
    Email
  }, (err, user) => {
    if(err)
      throw err;

    if(!user){
      res.json({
        code : req.app.get('ERRORS').USER_NOT_FOUND,
        message : 'Authentication failed. User not found.'
      });
    }else{
      const promise = UserOperations.VerifyPassword(Password,user.Password,user);

      promise.then((token) => {
        res.json({
          UserID: user._id,
          message : 'Succesfully login.',
          token: token
        });
      }).catch(() => {
        res.json({
          code : req.app.get('ERRORS').WRONG_PASSWORD,
          message : 'Authentication failed. Wrong password.'
        });
      });
    }
  });
});

/* POST Forget Password */
router.post('/forgetpassword', (req, res, next) => {
  const {Email} = req.body;
  UserOperations.ForgotPassword(Email).then((data) => {
    console.log(data);
      if(data==="ok"){
        res.json({
          Code: 200,
          message : 'Sıfırlama kodu mailinize gönderildi.'
        });
      }
  });
});

module.exports = router;