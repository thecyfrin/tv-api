const sendEmail = require("./email-controller");

module.exports = {
    sendOtp: async ({email, firstName, otpCode, duration=1}) => {
            //send email
            var fromEmail = process.env.AUTH_EMAIL;
            const mailOptions = {
                from: `"Viewzy" <${fromEmail}>`,
                to: `${firstName} <${email}>`,
                subject: 'Reset Password',
                html: `<html>
                        <body>
                            <p> Verify yourself. </p> <p style:"color:tomato; font-size: 25px; letter-spacing: 2px;"><b>${otpCode}</b></p>
                            <p> This code expires in ${duration} hours(s)</b>.</p>
                            </body>
                        </html>`, 
                        
            };

            await sendEmail(mailOptions);

    },
}