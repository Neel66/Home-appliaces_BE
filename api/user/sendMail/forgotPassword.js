const user = require('../sendMail/transport')
var mailOptions = {
    from :'neel84740@gmail.com',
    to : user.email,
    subject:'Request Forgot Password',
    html : ` <strong>Hi</strong>
             <br>
                &nbsp; Your One Time Password(OTP) is <b>${user.num}</b>
             The password will expire in ten minutes if not used.
             <br>
             <strong>Thank You</strong>
             <br>
             Home Aplliances`
             
}

module.exports = mailOptions;