const async = require('async');
const Complain = require('../models/complain');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

module.exports = {
  //User Send Complain
Complain : (req,res) =>{
    async.waterfall([
        (nextCall) => {
            const body = {
                complain : req.body.complain,
                uid : req.body.uid
            }
            nextCall(null,body)
        },
        (body, nextCall) => {
          console.log(body);
            const complain = new Complain(body);
            complain.save()
            .then( result => {
                nextCall(null,result);
            
            })
            .catch( err => {
                    nextCall(err)
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
          data: response
        })
      })
},

//Reply Complain admin
replyComplain : (req,res) => {
    async.waterfall([
       (nextCall) => {
        const body = {
         _id : req.body.id,
         reply : req.body.reply
       }
       nextCall(null,body);
    },
    (body, nextCall) => {
        Complain.findOneAndUpdate({_id : req.body.id}, body)
        .then( result => {
          console.log(result)
            nextCall(null,result)
          })
          .catch(err => {
            nextCall(err);
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
          message : "Reply send successfully",
          data: response
        })
      })
},

// Get Complain Admin
getComplain : (req,res) => {
async.waterfall([
  (nextCall) => {
    Complain.aggregate([
      {
        $lookup : {
          from : 'User',
          localField: 'uid',
          foreignField: '_id',
          as: 'Users'
        }
      },
      {
        $unwind : "$Users",
      },
    ]).then ( result => {
      nextCall(null,result)
    })
    .catch ( err => {
      nextCall(err)
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
      message : "All Complaines",
      data: response
    })
  })
},
//Delete complain
deleteComplain : (req,res) => {
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
      Complain.findByIdAndDelete({ _id : body.id})
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
      message : "Complain Delete Successfully",
      data: response
    })
  })
},
getreplyComplain : (req,res) => {
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
      console.log(body.id)
      Complain.find({uid :   ObjectId(body.id),reply: { $not : {$type: 'null'}}})
      .then( result => {
        if(result)
        nextCall(null,result)
      })
      .catch( err => {
        nextCall({msg : `Can't get data`, err})
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
      message : "Get Complain reply ",
      data: response
    })
  })
},
}