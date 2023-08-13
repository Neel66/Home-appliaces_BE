const mongoose = require('mongoose');
const connection = require('../db/connection');

const productName = mongoose.Schema({
    name : { type : String, required : true}
},
{
    collection: 'productname'
  })

  module.exports = connection.model(productName.options.collection, productName);