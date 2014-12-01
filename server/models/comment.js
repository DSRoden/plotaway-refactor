'use strict';

 var Mongo  = require('mongodb');

function Comment(o){
  this.tripId = o.tripId;
  this.ownerId = o.ownerId;
  this.senderId = o.senderId;
  this.content =  o.content;
  this.date = new Date();
}

Object.defineProperty(Comment, 'collection', {
  get: function(){return global.mongodb.collection('comments');}
});

Comment.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Comment.collection.findOne({_id:_id}, cb);
};

Comment.create = function(user, o, cb){
  o.senderId = user._id;
  o.tripId = Mongo.ObjectID(o.tripId);
  require('./trip').collection.findOne({_id: o.tripId}, function(err, trip){
    console.log('found trip for adding comment>>>>>>>>>>>', trip);
    o.ownerId = trip.userId;
    var num = trip.comments;
    num += 1;
    console.log('increased comment count>>>>>>>>>>>>>', num);
    require('./trip').collection.update({_id: trip._id}, {$set: {comments: num}}, function(err, updated){
      console.log('comment inserted and comment number of trip updated>>>>>>>>>>', updated);
      require('./user').collection.findOne({_id:o.ownerId}, function(err, user){
      var message = 'A comment has been made on your itinerary at http://daniel-vm.com:4444/#/itinerary/' + trip._id + '. The message reads: ' + o.content;
      sendEmail('postmaster@sandbox065d6ea564c84092b66f8ce88c474b4b.mailgun.org', user.email, message, function(err, resE){
        console.log('email error >>>>>>>>>>>>>>>>>', err);
        console.log('email res >>>>>>>>>>>>>>>>>>', resE);
      });
      var comment = new Comment(o);
      Comment.collection.save(comment, cb);
      });
    });
  });
};

Comment.all = function(id, cb){
  console.log('using the id from params to retrieve comments>>>>>>>>>>>', id);
  var _id = Mongo.ObjectID(id);
  Comment.collection.find({tripId: _id}).sort({date:-1}).toArray(cb);
};




function sendEmail(sender, to, body, cb){
  if(!sender || !to){return cb();}

  var apiKey  = process.env.MGKEY,
      domain  = process.env.MGDOM,
      Mailgun = require('mailgun-js'),
      mg      = new Mailgun({apiKey: apiKey, domain: domain}),
      subject = 'Your itinerary has been commented on!',
      data    = {from:sender, to:to, subject:subject, html:body};

  mg.messages().send(data, cb);
}


module.exports = Comment;

