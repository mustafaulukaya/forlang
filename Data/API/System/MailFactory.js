const Mailer = require('nodemailer');

const SystemMailAdress = 'noreply.lileduca@gmail.com';
const SystemMailPassword = 'bqo7d0u7!9.lil';

const transporter = Mailer.createTransport({
    service: 'gmail',
    auth: {
        user: SystemMailAdress,
        pass: SystemMailPassword
    }
});

let Mailoptions = {
    from : SystemMailAdress,
    to: 'to@email.com', // list of receivers
    subject: 'Please No Reply - LilEduca', // Subject line
    html: '<p>Test Content</p>'// plain text body
};

exports.SendMail = function (MailToList,Subject,Content) {
    Mailoptions.to = MailToList;
    Mailoptions.subject = Subject;
    Mailoptions.html = Content;


    transporter.sendMail(Mailoptions,function (err,info) {
       if(err)
           console.log("Error on Sending Mail");
       else
           console.log("Successfully Send Mail");
    });
};