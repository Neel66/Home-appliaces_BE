
const async = require('async');
const message = require('../config/message');
const Order = require('../models/or.model');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
    // order : (req,res) => {
    //   console.log(req.body);
    //     async.waterfall([
    //      (nextCall) => {
    //       const b = req.body
    //       const o = b.c;
    //       let userOrder = [];
    //       console.log(b.subtotal)
    //       o.forEach( e => {
    //          e.subtotal = b.subtotal;
    //          const payloads = {
    //           cartid : `(${e._id})`
    //       }
    //       console.log("payload",payloads)
    //           let row = '';
    //           row = {'userid' : `${e.userid}`,'productid':`${e.productid}`,'quantity':`${e.quantity}`,'totalprice':`${e.totalprice}`,'cartid':`${e._id}`,'subtotal':`${e.subtotal}`};
    //           userOrder.push(row);
    //       })
    //   nextCall(null, userOrder)
    //      },
    //      (body, nextCall) => {
    //       Order.insertMany(body)
    //          .then(result => {
    //              nextCall(null, result)
    //          })
    //          .catch( err => {
    //              nextCall({msg : 'err', err})
    //          })
    //      }
    //     ],
    //     (err, response) => {
    //         if (err) {
    //           return res.send({
    //             status: 0,
    //             message: err
    //           })
    //         }   
    //         res.send({
    //           status : 1,
    //           message: message.order,
    //           data: response
    //         })
    //       })
    // },
//OrderAddress
    orderAddress : (req,res) => {
    async.waterfall([
      (nextCall) => {
        req.checkBody('addressid', 'Id is required').notEmpty();
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
        Order.updateMany({_id : body.orderid},body)
        .then(result => {
          nextCall(null, result)
      })
      .catch( err => {
          nextCall({msg : 'err', err})
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
          message: message.address,
          data: response
        })
      })
    },
    //Order by user
  order : (req,res) => {  
    async.waterfall([
        (nextCall) => {
          req.checkBody('userid', 'User id is required').notEmpty();
          req.checkBody('items', 'Items is required').notEmpty();
          req.checkBody('subtotal', 'Subtotal name is required').notEmpty();

    var error = req.validationErrors();
    if (error && error.length) {
      return nextCall({
        message: error[0].msg
      })
    }
    nextCall(null, req.body)
      },
      (body, nextCall) => {
        Order.insertMany(body)
           .then(result => {
               nextCall(null, result)
           })
           .catch( err => {
               nextCall({msg : 'err', err})
           })
       },
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
        message: message.order,
        data: response
    })
    })
  },

  //order history
  orderHistory : (req,res) => {
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
        Order.aggregate([
          { $match : { userid :   ObjectId(body.userid)} },
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
          message: message.orderHistory,
          data: response
        })
      })
  }
}