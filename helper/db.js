const mongoose = require('mongoose');

module.exports = function () {
    //mongoose.connect('mongodb://admin:y3jG8mW2pMqwFyK@ds231307.mlab.com:31307/heroku_lmx0b541');
    mongoose.connect('mongodb://localhost/lileduca');
    mongoose.connection.on('open',()=> {
        console.log('MongoDB : Connected');
    });
    mongoose.connection.on('error',(err)=> {
        console.log('MongoDB : Error', err);
    });

    mongoose.Promise = global.Promise;
};