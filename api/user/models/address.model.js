const mongoose = require('mongoose');
const Schema = mongoose.Schema
const connection = require('../db/connection')

var schema = new Schema({
    houseno : { type : String , required : true},
    street : { type : String, required : true},
    landmark : { type : String},
    pincode : { type : Number, required : true}, 
    city : { type : String, required : true},
    district : { type : String, required : true},
    state : { type : String, required: true},
    userid : { type : mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true}
  }, {
    collection: 'userAddress'
  });

  module.exports = connection.model(schema.options.collection, schema)