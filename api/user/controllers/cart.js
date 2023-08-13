const Cart = require('../models/cart');
const async = require('async');
const message = require('../config/message');
const cart = require('../models/cart');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    //Addtocart by user
    addtoCart : (req,res) => {
        async.waterfall([
            (nextCall) => {

                req.checkBody('userid', 'User Id is required').notEmpty();
                req.checkBody('productid', 'Product Id is not a valid').notEmpty();
                req.checkBody('quantity', 'Quantity is required').notEmpty();
                req.checkBody('totalprice', 'Total Price is required').notEmpty();
                var error = req.validationErrors();
                if (error && error.length) {
                  return nextCall({
                    message: error[0].msg
                  })
                }
                nextCall(null, req.body)
            },
           (body, nextCall) => {
               const cart = new Cart(body);
               cart.save()
               .then( result => {
                   nextCall(null, result)
               })
               .catch( err => {
                   nextCall({msg : 'Somthing went wrong',err})
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
              message : message.addtoCart,
              data: response
            })
          })
    },
    //getCart User
    getCart : (req,res) => {
        async.waterfall([
            (nextCall) => {
                req.checkBody('userid', 'User Id is required').notEmpty();
                var error = req.validationErrors();
                if (error && error.length) {
                  return nextCall({
                    message: error[0].msg
                  })
                }
                nextCall(null, req.body)
            },
            (body, nextCall) => {
                cart.aggregate([
                  { $match : { userid :   ObjectId(body.userid)} },
                  {
                    $lookup : {
                      from : 'product',
                      localField: 'productid',  
                      foreignField: '_id',
                      as: 'Product'
                    }
                  },
                  {
                    $unwind : "$Product",
                  },
                ])
                .then( result => {
                  nextCall(null, result)
                })
                .catch( err => {
                    nextCall({msg : 'Somthing went wrong',err})
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
              message : message.getCart,
              data: response
            })
          })
    },
    //Remove Cart Product
    deleteCart : (req,res) => {
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
              cart.findByIdAndDelete({_id : body.id})
              .then( result => {
                nextCall(null, result)
              })
              .catch( err => {
                  nextCall({msg : 'Id is not valid',err})
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
            message : message.deleteCart,
            data: response
          })
        })
  }
}