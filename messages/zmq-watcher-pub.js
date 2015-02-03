#! /usr/bin/env node --harmony

'use strict';
const
  fs = require('fs'),
  zmq = require('zmq'),

  // Create a zmq publisher endpoint
  publisher = zmq.socket('pub'),

  // Watch the current directory
  dir = './';

fs.watch(dir, function(event, filename) {

  // Send messages to any subscribers
  publisher.send(JSON.stringify({
    type: "change",
    event: event,
    file: filename,
    timestamp: Date.now()
  }));

});

// Listen on TCP port 5432
publisher.bind('tcp://*:5432', function(err) {
  console.log('Listening for zmq on port 5432...');
});
