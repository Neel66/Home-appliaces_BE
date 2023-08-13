const mongoose = require('mongoose');
const connection = require('../../v1/db/connection');

const complain = mongoose.Schema({
    complain : { type : String , required : true},
    uid : { type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true},
        reply : { type : String, default : null}
},
{
    collection: 'complain'
  });

module.exports = connection.model(complain.options.collection, complain);