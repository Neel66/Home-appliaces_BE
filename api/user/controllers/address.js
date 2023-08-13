const Address = require('../models/address.model');
const async = require('async');



 module.exports = {
     // Add Address by User
 addAddress : (req,res) => {
async.waterfall([
    (nextCall) => {
        const body = {
            houseno : req.body.houseno,
    street : req.body.street,
    landmark : req.body.landmark,
    pincode : req.body.pincode, 
    city : req.body.city,
    district : req.body.district,
    state : req.body.state,
    userid : req.body.id
        }
        nextCall(null,body)
    },
    (body, nextCall) => {
        const address = new Address(body)
        address.save()
        .then( result => {
            nextCall(null,result)
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
      message: 'Address Add Successfully',
      data: response
    })
  })
 },

//User Get his/her All address
address: (req,res) => {
    async.waterfall([
      (nextCall) => {
        req.checkBody('userid', 'Id is required').notEmpty();
        var error = req.validationErrors();
        if (error && error.length) {
          return nextCall({
            message: error[0].msg
          })
        }
        nextCall(null, req.body)
      },
      (body, nextCall) => {
        Address.find({userid : body.userid})
        .then( result => {
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
          message: 'User Address',
          data: response
        })
      })
},
//Delete Address

deleteAddress : (req,res) => {
  async.waterfall([
    (nextCall) => {
      req.checkBody('id', 'id is required').notEmpty();
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
      Address.findByIdAndDelete({ _id : body.id})
      .then( result => {
        nextCall(null,result)
      })
      .catch( err => {
        nextCall({msg : 'Id is a Not Found'})
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

    res.send({
      status : 1,
      message : "Address Delete Successfully",
      data: response
    })
  })
}
 }