const Product = require('../models/product.models'); 
const async = require('async');
const message = require('../config/message')
module.exports = {
    //User Get All Product In home page
    getProducts : (req,res) => {
        async.waterfall([
            (nextCall) => {
            Product.find({})
            .then( result => {
                nextCall(null, result)
                return true;
            })
            .catch ( err => {
                nextCall({msg : err})
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
              message :  message.getProducts,
              data: response
            })
          })
    },

    //User See Product Detailes
    productDetailes : (req,res) => {
        async.waterfall([
          (nextCall) => {
            Product.findById({_id : req.params.id})
            .then( result => {
              nextCall(null,result)
              return true;
            })
            .catch ( err => {
              nextCall({msg: 'Id is not found', err})
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
            message : message.productDetailes,
            data: [response]
          })
        })
       },


}
