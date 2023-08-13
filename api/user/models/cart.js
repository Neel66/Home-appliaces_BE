const mongoose = require('mongoose');
const connection = require('../db/connection');

const productSchema = mongoose.Schema({
  userid : { type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true},
  productid : { type : mongoose.Schema.Types.ObjectId, ref : 'User', required : true },
  quantity : { type:Number, required : true},
  totalprice : { type : Number , required : true}
},
{
    collection: 'Cart'
  })

module.exports = connection.model(productSchema.options.collection, productSchema);