#! /usr/bin/env node --harmony

'use strict';

const
  fs = require('fs'),
  zmq = require('zmq'),

  // Socket to reply
  responder = zmq.socket('rep');

// Handle incoming requests
responder.on('message', function(data) {

  // Parse incoming message
  let request = JSON.parse(data);
  console.log('Received request for ' + request.path);

  // Read file and reply with content
  fs.readFile(request.path, function(err, content) {
    console.log('Sending response content');
    responder.send(JSON.stringify({
      content: content.toString(),
      timestamp: Date.now(),
      pid: process.pid
    }));
  });

});

// Listen on TCP port 5433
responder.bind("tcp://127.0.0.1:5433", function(err) {
  console.log('Listening for zmq requesters...');
});

// Close the responder when the Node process ends
process.on('SIGINT', function() {
  console.log('Shutting down...');
  responder.close();
});
