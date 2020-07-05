const nodemailer = require("nodemailer");

let mailLib = {
    sendMail: (data) => {
        return new Promise((resolve, reject) => {
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'sauravgarg.edwisor@gmail.com',
                    pass: 'Meanstack@24'
                }
            });

            let mailOptions = {
                from: 'sauravgarg.edwisor@gmail.com',
                to: data.to,
                subject: data.subject,
                text: data.text
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    reject(error);
                } else {
                    resolve('Email sent: ' + info.response);
                }
            });
        });
    }
}

module.exports = mailLib;