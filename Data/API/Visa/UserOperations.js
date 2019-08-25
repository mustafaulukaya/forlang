const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../../../app');

const GeneralFunctions = require('../System/General');
const MailFactory = require('../System/MailFactory');
const User = require('../../../Data/Models/Visa/user');
const ForgotPassword = require('../../../Data/Models/General/ForgotPassword');

const CodeExpireTimeMin = 5;

exports.Save = function (Name, Surname, Email, Password) {
    return new Promise((resolve,reject) => {

        User.findOne({
            Email
        },(err,user) => {
           if(user){
               reject({
                   code : 80,
                   message: "Email already exist."
               });
           }
           else{
               bcrypt.hash(Password,10).then((hash) => {
                   const user = new User({
                       Name,
                       Surname,
                       Email,
                       Password : hash
                   });

                   const promise = user.save();

                   promise.then((data) => {
                       let subject = 'LilEduca - Hoşgeldiniz!';
                       let content = 'LilEducaya hoş geldiniz! Bizi tercih ettiğiniz için teşekkürler :)';

                       MailFactory.SendMail(Email,subject,content);
                       resolve(data);
                   });
               });
           }
        });


    });
};

exports.VerifyPassword = function (input_pass, exist_pass,user) {
    return new Promise((resolve,reject) => {
        bcrypt.compare(input_pass, exist_pass).then((result) => {
            if(result){
                const payload = {
                    ID : user._id,
                    Name : user.Name,
                    Surname: user.Surname,
                    Email: user.Email,
                };

                const token = jwt.sign(payload, global.jwt_secret_key,{
                    expiresIn : 720 //12 saat - dakika cinsinden
                });

                resolve(token);

            }else{
                reject();
            }
        });
    });
};

exports.GetInformation = function (UserID) {
      return  User.findOne({
          "_id": UserID
      });
};

exports.ForgotPassword = function (Email) {
  return new Promise(((resolve, reject) => {
    User.findOne({
        Email
    },(err,user) => {
        console.log("UserOperations - UserFind");
        if(user){
            const Code = GeneralFunctions.GenerateCode(8);

            console.log("UserOperations - Finded User - Code: " + Code);

            let date = new Date();
            date.setMinutes(date.getMinutes() + CodeExpireTimeMin);

            ForgotPassword.findOne({
                Email
            },(err,data) => {
                console.log("UserOperations - ForgotPasswordFind");
                if(data){
                    console.log("UserOperations - ForgotPasswordFinded");
                    data.Code = Code;
                    data.LastDate = date;
                }
                else{
                    console.log("UserOperations - New ForgotPasswordFind");
                    data = new ForgotPassword({
                        Email,
                        Code,
                        LastDate : date
                    });
                }

                if(!err){
                    data.save().then((entity) => {
                        console.log("UserOperations - ForgotPassword- successfull",entity);
                        let subject = 'LilEduca - Şifremi Unuttum';
                        let content = 'Şifre yenileme için gereken parola ' + CodeExpireTimeMin + ' dakika boyunca geçerlidir. Kodunuz: ' + Code;

                        MailFactory.SendMail(Email,subject,content);
                        resolve("ok");
                    });
                }
                else{
                    console.log("UserOperations - ForgotPassword- error");
                    resolve("error");
                }

            });
        }
        else{
            console.log("UserOperations - UserNotFound");
            resolve("usernotfound");
        }

    });
  }));
};

exports.ChangePassword = function (old_pass,new_pass,UserID) {
    User.findById(UserID,(err,user) => {
        if(user){
            user.ModifiedAt = new Date();
            user.save((err) => {
                if(err)
                    console.log("Error on User Update");
            });
        }
    });
};

exports.RenewPassword = function (Email,new_pass,code) {
    return new Promise(((resolve, reject) => {
        ForgotPassword.findOne({
            Email
        },(err,data) => {
            if(data){
                let date = new Date();

                if(date > data.LastDate){
                    ForgotPassword.deleteOne({
                        Email
                    },(err,data) => {
                        reject("Expired");
                    });
                }
                else if(data.Code === code){
                    User.findOne({
                        Email
                    },(err,user) => {
                        bcrypt.hash(new_pass,10).then((hash) => {
                            user.Password = hash;
                            const promise = user.save();
                            promise.then((data) => {
                                resolve(data);
                            });
                        });
                    });
                }
                else{
                    reject("WrongCode");
                }
            }
        });
    }));
};