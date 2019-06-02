const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if(token){
    jwt.verify(token, req.app.get('jwt_secret_key'), (err,decode) => {
       if(err){
           res.json({
               errCode: req.app.get('ERRORS').FAILED_AUTHENTICATE_TOKEN,
               message: 'Failed to authenticate token.'
           });
       }
       else{
           req.decode = decode;
           next();
       }
    });
  }else{
      res.json({
          errCode: req.app.get('ERRORS').NO_TOKEN_PROVIDED,
          message: 'Authentication required. No token provided.'
      });
  }
};