const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
    }
});



exports.sendWelcomeEmail = async (to, subject, text) => {
    await transporter.sendMail({ from: process.env.EMAIL_FROM, to: to, subject: subject, text: text }, async function (error, info) {
        if (error) {
            await console.log(error);
        } else {
            // await console.log('Email sent: ' + info.response);
        }
    });
};

exports.sendAccountTerminationEmail = (to, subject, text) => {
    transporter.sendMail({ from: process.env.EMAIL_FROM, to: to, subject: subject, text: text }, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};