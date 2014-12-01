'use strict';

var request = require('request');

exports.findDestination = function(req,res){
  console.log('go sherpa go>>>>>>>>>>>>>', req.body);
  var url = 'http://www.wikisherpa.com/api/1/page/en/'  +req.body.destination + '?apiKey=cdc4187d-9915-4c34-a6ca-47545d7d4a65';
  request(url, function(error, response, destination){
    destination = JSON.parse(destination);
    res.send({destination:destination});
  });
};
