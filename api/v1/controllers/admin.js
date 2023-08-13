const jwt = require('jsonwebtoken');
const async = require('async');
const userSchema = require('../models/Admin');
const config = rootRequire('config')
const bcrypt = require('bcrypt');
const { result } = require('lodash');

module.exports = {
  test: (req, res) => {
    res.sendToEncode({
      status: 1,
      message: 'TEST 11 MESSAGE',
      data: {
        message: 'test'
      }
    })
  },
  signup: (req, res) => {
    async.waterfall([
      // (nextCall) => {
      //         req.checkBody('email', 'Email is required').notEmpty();
      //         req.checkBody('email', 'Email is not a valid').isEmail();
      //         req.checkBody('password', 'Password is required').notEmpty();
      //         req.checkBody('first_name', 'First name is required').notEmpty();
      //         req.checkBody('last_name', 'Last name is required').notEmpty();
      //         req.checkBody('gender', 'Gender is required').notEmpty();

      //         if (req.body.gender != 'male' && req.body.gender != 'female') {
      //           nextCall({ message: 'Please select valid gender.' })
      //         }

      //   var error = req.validationErrors();
      //   if (error && error.length) {
      //     return nextCall({
      //       message: error[0].msg
      //     })
      //   }
      //   nextCall(null, req.body)
      //       },
      (nextCall) => {
        const body = {
          username: req.body.username,
          email: req.body.email,
         mobile: req.body.mobile,
          password: userSchema.hashpassword(req.body.password)
        }
        nextCall(null, body)
      },
      (body, nextCall) => {
        console.log(body)
        var newUser = new userSchema(body);
        newUser.save()
          .then(result => {
            console.log(result)
            nextCall(null,result)
            return true;
          })
          .catch(err => {
            nextCall(err)
            return false;
          })
      },


    ], (err, response) => {
      if (err) {
        return res.sendToEncode({
          status: 0,
          message: err
        })
      }

      res.sendToEncode({
        status: 1,
        message: 'Registration successflly',
        data: response
      })
    })
  },

  // Get User List
  getUser: (req, res) => {
    async.waterfall([
      (nextCall) => {
        userSchema.aggregate([
          {
            $limit: 2
          }
        ])
          .then((result) => {
            nextCall(result)
          })
          .catch(err => {
            nextCall(err);
          })
      }

    ]).catch(err => {
      res.send(err);
    })
  },
  // Update User 
  updateUser: (req, res) => {
    async.waterfall([
      (nextCall) => {
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('email', 'Email is not a valid').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('first_name', 'First name is required').notEmpty();
        req.checkBody('last_name', 'Last name is required').notEmpty();
        req.checkBody('gender', 'Gender is required').notEmpty();

        if (req.body.gender != 'male' && req.body.gender != 'female') {
          nextCall({ message: 'Please select valid gender.' })
        }

        var error = req.validationErrors();
        if (error && error.length) {
          return nextCall({
            message: error[0].msg
          })
        }
        nextCall(null, req.body)
      },
      (body, nextCall) => {
        console.log('Body', body)
        userSchema.findByIdAndUpdate({ _id: req.body.id }, body)
          .then(result => {
            nextCall(result)
          })
          .catch(err => {
            nextCall(err);
          })
      }
    ])
      .catch(err => {
        res.send(err);
      })
  },

  //deleteuser
  deleteUser: (req, res) => {
    async.waterfall([
      (nextCall) => {
        userSchema.findByIdAndDelete({ _id: req.body.id })
          .then(res => {
            nextCall(null,res);
          })
          .catch(err => {
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
        message: 'Admin Delete Successfully',
        data: response
      })
    })
  },

  //login User

  login: (req, res) => {
    async.waterfall([
      (nextCall) => {
        userSchema.find({ emailid : req.body.emailid})
        .then( result => {
          console.log(result);
          nextCall(null,result);
          return true;
        })
        .catch( err => {
      res.send({msg: 'emailid is a wrong' })
        })
      },
      (result,nextCall) => {
        bcrypt.compare(req.body.password, result[0].password, (err, res) => {
          if( res == true){
            nextCall(null,result)
          }
          else{
            nextCall({msg: 'Password is a wrong'})
          }
        })
      },
      (tokan,nextCall) => {
        var jwtData = {
          id: 1,
          emailid: tokan[0].emailid,
          _id : tokan[0]._id
        }
        access_token = jwt.sign(jwtData, 'homeappliances', {
          expiresIn: 60 * 60 * 24 
        })
        nextCall(null,access_token)
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
        message: 'Login successfully',
        tokan: response
      })
    })
  },

  user : (req,res) => {
    console.log(req.body.page)
    async.waterfall([
      (nextCall) => {
        if( req.body.page == undefined){
          var p = 1;
        }
        else {
          var p = req.body.page;
        }
        var limit = 2, page = Math.max(limit * req.body.page - limit) 
        userSchema.aggregate([
          {
            $facet: {
              paginatedResults: [{ $skip: page || 0}, { $limit: limit }, { $project : {password:0}}],
              totalCount: [
                {
                  $count: 'count'
                }
              ]
            }
          }
          // {
          // $skip : (page)
          // },
          // {
          // $limit : (limit)
          // },
          // {
          //   $project : {username: 1, email : 1, mobile : 1}
          // },
     
        ])
        // userSchema.find({})
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
        message: 'All Admin',
        data: response
      })
    })
  },

 
}
