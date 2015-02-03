#! /usr/bin/env node --harmony

'use strict';

const
  zmq = require('zmq'),
  filename = process.argv[2],

  // Create request endpoint
  requester = zmq.socket('req');

// Handle replies
requester.on('message', function(data) {
  let response = JSON.parse(data);
  console.log("Received response: ", response);
});

requester.connect("tcp://localhost:5433");

// Send content request
console.log('Sending request for ' + filename);
requester.send(JSON.stringify({
  path: filename
}));
