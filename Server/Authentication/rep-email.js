const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv     = require('dotenv'); 
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2 = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2.setCredentials({ refresh_token: REFRESH_TOKEN });


const nocb = () => { };


class REPEmail {

    constructor() { }

    REPEmail = "monroerepvblic@gmail.com";

    transporter;

    sendMail = async (to, subject, text, callback = nocb) => {

        const access_token = await oAuth2.getAccessToken();

        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: this.REPEmail,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: access_token
            }
        });

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