const nodemailer = require('nodemailer');
const auth = require('../auth/jwt');
require('dotenv').config();

class EmailSender {
    async emailSenderFunc(user) {
        try {
            const mergedSecretKey= user.password + process.env.SECRET_TOKEN_JWT;
            const token = await auth.createTokenFiveMinute({userId : user.id, emailAddress : user.emailAddress},mergedSecretKey);
            const link =  `${process.env.API_URL}/user/resetPassword/${user.id}/${token}`;


            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.TEST_EMAIL,
                    pass: process.env.TEST_EMAIL_PASS
                },
            });
            console.log("hiiiii");
            console.log(link);
            const mailOptions = {
                from: process.env.TEST_EMAIL,
                to: user.emailAddress,
                subject: 'Email password reset',
                html: `<p style="color:black" >Hello ${user.firstName},</p>
                        </br>
                       <div style="font-weight:700;color:black">Password Reset link : </div>
                       </br>
                       <a href="${link}" target="_blank">${link}</a>`
            }
            const var1 = await transporter.sendMail(mailOptions);
            // if (err) {
            //     // console.log("err", err);
            //     return 0;
            // } else {
            //     console.log("email sent successfully!  " + info.response);
            //     // return info.response;
            //     return 1;
            // }
            console.log(var1);
            return var1;
            // return info;
        } catch (err) {
            throw err;
        }
        
    }
}

const emailSender = new EmailSender();

module.exports = emailSender;
