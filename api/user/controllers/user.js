const async = require('async');
const User = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const message = require('../config/message')

module.exports = {
  //User Registration
  signup : (req,res) => {
    async.waterfall([
      (nextCall) => {
                  req.checkBody('email', 'Email is required').notEmpty();
                  req.checkBody('email', 'Email is not a valid').isEmail();
                  req.checkBody('password', 'Password is required').notEmpty();
                  req.checkBody('username', 'UserName  is required').notEmpty();
                  req.checkBody('mobile', 'Mobile name is required').notEmpty();
                  req.checkBody('mobile', 'Mobile Number not is a Valid').isNumeric();
    
    
            var error = req.validationErrors();
            if (error && error.length) {
              return nextCall({
                message: error[0].msg
              })
            }
            nextCall(null, req.body)
        },
        (body,nextCall) => {
          const password = User.hashpassword(body.password)
          body.password = password;
          console.log(password)
            const user = new User(body)
            user.save()
            .then( res => {
              console.log('re',res)
              const result = res.toJSON();
                nextCall(null,result)
            })
            .catch( err => {
              if(err.keyValue.mobile){
                res.send({msg: message.mobile})
              }
            else {
              res.send({msg : message.email})
            }
                })
        },
        (user,nextCall) => {
          var jwtData = {
            emailid: user.email,
            _id : user._id
          }
          user.access_token = jwt.sign(jwtData, 'homeappliances', {
            expiresIn: 60 * 60 * 24 
          })
          delete user.password;
          console.log(user)
          nextCall(null,user)
        },
    ] , (err, response) => {
        if (err) {
          return res.send({
            status: 0,
            message: err
          })
        }
        res.send({
          status : 1,
          message: message.signUp,
          data: response
        })
      })
},
//User Login
login : (req,res) => {
  async.waterfall([
    (nextCall) => {
      req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not a valid').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();
        var error = req.validationErrors();
        if (error && error.length) {
          return nextCall({
            message: error[0].msg
          })
        }
        nextCall(null, req.body)
    },
      (body,nextCall) => {
        User.findOne({ email : body.email})
        .then( user => {
          if(user){
            let result = user.toJSON();
            nextCall(null,result)
          }
          else{
            nextCall({msg : message.user})
          }
        })
        .catch( err => {
          nextCall(err)
        })
      },
    (result,nextCall) => {
      bcrypt.compare(req.body.password, result.password, (err, res) => {
        if( res == true){
          nextCall(null,result)
        }
        else{
          nextCall({msg: message.password})
        }
      })
   
    },
  (user,nextCall) => {
    var jwtData = {
      emailid: user.email,
      id : user._id
    }
    user.access_token = jwt.sign(jwtData, 'homeappliances', {
      expiresIn: 60 * 60 * 24 
    })
    delete user.password
    console.log('user', user)
    nextCall(null,user)
  },
  ], (err, response) => {
    if (err) {
      return res.send({
        status: 0,
        message: err
      })
    }
    res.send({
      status: 1,
        message: message.logIn,
      data: response
    })
  })
},
//Get AllUsers
getAllUsers : (req,res) => {
async.waterfall([
  (nextCall) => {
    var limit = 2, page = Math.max(limit * req.params.page - limit)
    User.find({}, {password : 0}).limit(limit).skip(page || 1)
    .then(result => {
      nextCall(null, result)
    })
    .catch( err => {
      nextCall(err)
    })
  }
], (err, response) => {
  if (err) {
    return res.send({
      status: 0,
      message: err
    })
  }

  res.send({
    status: 1,
    message: message.getUsers,
    data: response
  })
})
},
//Delete Users
deleteUser : (req,res) => {
  async.waterfall([
    (nextCall) => {
      req.checkBody('id', 'Id is required').notEmpty();
      var error = req.validationErrors();
      if (error && error.length) {
        return nextCall({
          message: error[0].msg
        })
      }
      nextCall(null, req.body)
    },
    (body, nextCall) => {
      User.findByIdAndDelete({ _id: body.id })
      .then(res => {
        nextCall(null,res);
      })
      .catch(err => {
        nextCall({msg : 'Id is not valid'})
      }) 
    }
  ], (err, response) => {
    if (err) {
      return res.send({
        status: 0,
        message: err
      })
    }

    res.send({
      status: 1,
      message: message.delUser,
      data: response
    })
  })
},
//Get UserDetailes by id  
getUserDetailes : (req,res) => {
  console.log(req.body)
  async.waterfall([
    (nextCall) => {
      req.checkBody('id', 'Id is a required').notEmpty();
        var error = req.validationErrors();
        if (error && error.length) {
          return nextCall({
            message: error[0].msg
          })
        }
        nextCall(null, req.body)
      },
      (body, nextCall) => { 
        User.findById({ _id : body.id}, {password: 0})
        .then( result => {
          nextCall(null,result)
        })
        .catch ( err => {
          nextCall({msg: 'Id is a wrong'});
        })
      }
  ], (err, response) => {
    if (err) {
      return res.send({
        status: 0,
        message: err
      })
    }

    res.send({
      status: 1,
      message: message.userDetailes,
      data: response
    })
  })
},

//Update User
updateUser : (req,res) => {
async.waterfall([
  (nextCall) => {
    console.log(req.body)
    req.checkBody('username', 'UserName  is required').notEmpty();
    req.checkBody('mobile', 'Mobile name is required').notEmpty();
    req.checkBody('mobile', 'Mobile Number not is a Valid').isNumeric();


var error = req.validationErrors();
if (error && error.length) {
return nextCall({
  message: error[0].msg
})
}
nextCall(null, req.body)
  },
  (body, nextCall) => {
    console.log(body)
    User.findOneAndUpdate({ _id : body.id}, body)
    .then( result => {
      nextCall(null, result)
    })
    .catch( err => {
      nextCall({msg: 'User Not Found'})
      return false;
    })
  }
], (err, response) => {
  if (err) {
    return res.send({
      status: 0,
      message: err
    })
  }
  res.send({
    status: 1,
    message: message.updateUser,
    data: response
  })
})
},


}
