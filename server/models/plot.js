'use strict';

 var Mongo  = require('mongodb');

function Plot(o, date, time){
  this.userId = o.userId;
  this.tripId = o.tripId;
  this.pageId = o.pageId;
  this.description = o.description || 'No Description';
  this.date  = date || 'No Date';
  this.time  = time || 'No Time';
  this.priority = o.priority || 'No Priority';
  this.category = o.category || 'No Category';
  this.cost = parseInt(o.cost) || 0;
}

Object.defineProperty(Plot, 'collection', {
  get: function(){return global.mongodb.collection('plots');}
});

Plot.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Plot.collection.findOne({_id:_id}, cb);
};

Plot.create = function(user, o, cb){
  o.userId = user._id;

  require('./trip').collection.findOne({userId: user._id, isSet: true}, function(err, trip){
    o.tripId = trip._id;
    require('./page').collection.findOne({userId: user._id, isSet: true}, function(err, page){
      o.pageId = page._id;
      var date = o.time.date,
       time = o.time.time,
      plot = new Plot(o, date, time);
      Plot.collection.save(plot, cb);
    });
 });
};

Plot.all = function(user, cb){
  require('./page').collection.findOne({userId: user._id, isSet:true}, function(err, page){
    console.log('this is the page associated with Plot.all>>>>>>>>', page);
    require('./trip').collection.findOne({userId: user._id, isSet:true}, function(err, trip){
      if(page){
      Plot.collection.find({pageId: page._id}).sort({date: 1, time: 1}).toArray(cb);
      } else {
        cb();
      }
    });
  });
};

Plot.perpage = function(user, page, cb){
  var id = Mongo.ObjectID(page._id);
  console.log('this is the page id>>>>>>', id);

  require('./page').collection.findOne({_id:id}, function(err, foundpage){
    console.log('this is the found  page>>>>>>>>>>>>>>>', foundpage);
    require('./page').collection.update({_id:foundpage._id}, {$set: {isSet: true}}, function(err, something){
      Plot.collection.find({pageId:id}).sort({date: 1, time: 1}).toArray(cb);
    });
  });
};

//Plot.allPerTrip = function(user, cb){
  //require('./trip').collection.findOne({_id: user._id, isSet: true}, function(err, trip){
    //console.log(trip);
    //Plot.collection.find({tripId:trip._id}).toArray(cb);
  //});
//};


Plot.remove = function(id, cb){
  console.log(id);
  id = Mongo.ObjectID(id);
  Plot.collection.remove({_id:id}, cb);
};

Plot.getItinPlots = function(o, cb){
  console.log(o.pageId);
  var id = Mongo.ObjectID(o.pageId);
  console.log(id);
  Plot.collection.find({pageId:id}).sort({date: 1, time: 1}).toArray(cb);
};

module.exports = Plot;

