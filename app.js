const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

//db connection
const db = require('./helper/db')();
//Config
const config = require('./Config');
app.set('jwt_secret_key',config.jwt_secret_key);


//Error Codes
const errors = require('./ErrorCodes');
app.set('ERRORS',errors.ERRORS);


//Middleware
const verifyToken = require('./middleware/verifylogin');

const today = new Date();
const date = today.getDate()+'.'+(today.getMonth()+1)+'.'+today.getFullYear();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date+' || '+time;


//Build Time
app.set('BuildTime', dateTime)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api',verifyToken);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: {
      code : err.code,
      message: err.message
    }
  });
});

module.exports = app;
