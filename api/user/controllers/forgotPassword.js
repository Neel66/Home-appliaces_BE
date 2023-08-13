const async = require('async');
const User = require('../models/user.models');
const transport = require('../sendMail/transport');

async function sendMail(user,callback)  {
    console.log('u',user, callback)
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
     await transport.sendMail(mailOptions , (err, info) => {
     if(err){
      callback({msg : "Internet Connection Required"})
     }
     else{
      callback(info)
     }
    }) 
    }

module.exports = {
     sendmail : (req,res) => {
      async.waterfall([
        (nextCall) => {
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('num', 'num is required').notEmpty();
            var error = req.validationErrors();
            if (error && error.length) {
              return nextCall({
                message: error[0].msg
              })
            }
            nextCall(null, req.body)
        },
        (body, nextCall) => {
            User.findOne({ email : body.email})
            .then( result => {
              console.log(result)
                if(result == null){
                    nextCall('User Not Found')
                    console.log('anull')
                }
                else{
                    console.log('mail')
                    console.log(sendMail)
                    sendMail(body,info => {
                      if(info.msg == "Internet Connection Required"){
                      nextCall("Internet Connection Required")
                      }
                      else{
                        console.log('mail send');
                        nextCall(null,info)
                      }
                    })
                }
            })
            .catch ( err => {
                nextCall(err)
                return false;
            })
        }
      ],
      (err, response) => {
          if (err) {
            return res.send({
              status: 0,
              message: err
            })
          }
          console.log(response)
          res.send({
            status : 1,
            message: message.mailSend,
            data: response
          })
        })
     },

    forgotPassword : (req,res) => {
    async.waterfall([
        (nextCall) => {
            req.checkBody('email', 'Email is required').notEmpty();
            req.checkBody('password', 'Password is required').notEmpty();
            var error = req.validationErrors();
            if (error && error.length) {
              return nextCall({
                message: error[0].msg
              })
            }
            nextCall(null, req.body)
        },
        (body,nextCall) =>{
          const password = User.hashpassword(body.password)
          body.password = password;
            User.findOneAndUpdate({email : body.email}, body)
            .then( result => {
            nextCall(null, result)
            return true;
        })
        .catch ( err => {
            nextCall({msg : err})
            return false;
        })
        }
    ],
    (err, response) => {
        if (err) {
          return res.send({
            status: 0,
            message: err
          })
        }
        console.log(response)
        res.send({
          status : 1,
          message: message.forgotPassword,
          data: response
        })
      })
    }
}