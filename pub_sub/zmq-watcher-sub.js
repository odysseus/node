#! /usr/bin/env node --harmony

'use strict';
const
  zmq = require('zmq'),

  // Create subscriber endpoint
  subscriber = zmq.socket('sub');

// Subscribe to all messages
subscriber.subscribe("");

// Handle messages from the publisher
subscriber.on("message", function(data) {
  let
    message = JSON.parse(data),
    date = new Date(message.timestamp);
  console.log(
    "File: " + message.file + " changed. Event: " + message.event + ". Time: " + date
  );
});

// Connect to the publisher
subscriber.connect("tcp://localhost:5432");
