'use strict';

 var Mongo  = require('mongodb');

function Page(o){
  this.title = o.title;
  this.userId = o.userId;
  this.isSet = (o.isSet) ? true : false;
  this.tripId = o.tripId;
}

Object.defineProperty(Page, 'collection', {
  get: function(){return global.mongodb.collection('pages');}
});

Page.findById = function(o, cb){
  var _id = Mongo.ObjectID(o.PageId);
  Page.collection.findOne({_id:_id}, cb);
};


Page.create = function(user, o, cb){
  o.userId = user._id;

  require('./trip').collection.findOne({userId: user._id, isSet: true}, function(err, trip){
    o.tripId = trip._id;
    var page = new Page(o);
    Page.collection.save(page, cb);
  });
};

Page.all = function(user, cb){
  Page.collection.find({userId:user._id}).toArray(cb);
};

Page.allByTripId = function(trip, cb){
  var id = Mongo.ObjectID(trip._id);
  Page.collection.find({tripId: id}).toArray(cb);
};

//Page.set = function(user, o, cb){
  //console.log(user);
  //console.log('the id of the page>>>>>>', o.page);
     //var pId = Mongo.ObjectID(o.page);
  //console.log('this is the pId being compared>>>>>>>', pId);
  //Page.collection.update({userId: user._id}, {$set: {isSet: false}}, {multi: true}, function(err, pages){
    //Page.collection.update({_id: pId}, {$set: {isSet: true}}, function(err, page){
      //console.log('this is the page coming from inside the model>>>>>>>>>>>', page);
     //cb(null, page);
    //});
  //});
//};

Page.set = function(user, o, cb){
  var _id = Mongo.ObjectID(o.page);
  Page.collection.update({userId: user._id}, {$set: {isSet: false}}, {multi: true}, function(err, pages){
    Page.collection.update({_id:_id}, {$set: {isSet: true}}, function(err, page){
      console.log(o.page);
      Page.collection.findOne({_id:_id}, function(err, page){
        cb(null, page);
      });
    });
  });
};

Page.lastPage = function(user, cb){
  console.log('inside last page>>>>>>>>>>>', user);
  Page.collection.findOne({userId: user._id, isSet: true}, function(err, page){
    console.log('getting last page>>>>>>>>>>>>>', page);
    cb(err, page);
  });
};

Page.remove = function(id, cb){
  console.log(id);
  id = Mongo.ObjectID(id);
  require('./plot').collection.remove({pageId:id}, function(err, something){
    Page.collection.remove({_id:id}, cb);
  });
};


module.exports = Page;

