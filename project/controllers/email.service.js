var nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Logs = mongoose.model('Logs');

var smtpConfig = {
    host: 'smtp.ilait.se',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: '',
        pass: ''
    }
};
var transporter = nodemailer.createTransport(smtpConfig);

module.exports = {

    sendMail(to, subject, text, ch, msg) {
        var mailOptions = {
            from: "", // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text
        };
        return new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                    //Add to parking lot queue from here
                    reject(err, err.stack);

                } else {
                    console.log("Message sent: " + response);
                    var logs = new Logs();
                    logs.email = to;
                    logs.name = subject;
                    logs.save((err, doc) => {})
                    ch.ack(msg);
                    resolve(data);
                }
            });
        });
    }
};