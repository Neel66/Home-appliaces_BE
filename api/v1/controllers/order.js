const async = require('async');
const Order = require('../models/order.model');

module.exports = {
    //Getorder by admin
    getOrder : (req,res) => {
        async.waterfall([
            (nextCall) => {
                Order.aggregate([
                    { $lookup : {
                        from : 'product',
                        localField: 'items.productid',
                        foreignField: '_id',
                        as: 'Product'
                      }},
                    { $lookup : {
                        from : 'userAddress',
                        localField: 'addressid',
                        foreignField: '_id',
                        as: 'userAddress'
                      }},
                      { $lookup : {
                        from : 'User',
                        localField: 'userid',
                        foreignField: '_id',
                        as: 'User'
                      }},
                      { $unwind : '$userAddress'},
                      {$unwind : '$User'},
                ])
                .then( result => {
                    nextCall(null, result)
                    console.log(result)
                    return true;
                })
                .catch ( err => {
                    nextCall({msg : err})
                    return false;
                })
                }
            ], (err, response) => {
                if (err) {
                  return res.sendToEncode({
                    status: 0,
                    message: err
                  })
                }
          
                res.sendToEncode({
                  status: 1,
                  message :  "All Orders",
                  data: response
                })
              })
    },
    updateOrderplace : (req,res) => {
      async.waterfall([
        (nextCall) => {
          req.checkBody('ordertraking', 'Ordertraking is required').notEmpty();
          req.checkBody('id', 'id is required').notEmpty();
          var error = req.validationErrors();
          if (error && error.length) {
              return nextCall({
                message: error[0].msg
              })
            }
            console.log("body", req.body)
            nextCall(null, req.body)
        },
        (body, nextCall) => {
          Order.findOneAndUpdate({ _id : body.id}, body)
          .then( result => {
            nextCall(null, result)
          })
          .catch( err => {
            nextCall({msg: 'Order Not Found'})
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
    confirmOrder : (req,res) => {
      async.waterfall([
        (nextCall) => {
          req.checkBody('ordertraking', 'Ordertraking is required').notEmpty();
          req.checkBody('id', 'id is required').notEmpty();
          req.checkBody('confirmorderdate', 'Confirm Order Date is required').notEmpty();
          var error = req.validationErrors();
          if (error && error.length) {
              return nextCall({
                message: error[0].msg
              })
            }
            console.log("body", req.body)
            nextCall(null, req.body)
        },
        (body, nextCall) => {
          Order.findOneAndUpdate({ _id : body.id}, body)
          .then( result => {
            nextCall(null, result)
          })
          .catch( err => {
            nextCall({msg: 'Order Not Found'})
          })
        }
      ])
    }
}