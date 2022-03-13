const nodemailer = require('nodemailer');


const nocb = () => { };


class REPEmail {

    constructor() { }

    REPEmail = "monroerepvblic@gmail.com";

    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: this.REPEmail,
            pass: 'x1FU2U2Qetll'
        }
    });

    sendMail = (to, subject, text, callback = nocb) => {

        const mailOptions = {
            from: this.REPEmail,
            to: to,
            subject: subject,
            html: text
        };

        this.transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, info);
            }
        });
    }
}



module.exports = REPEmail;