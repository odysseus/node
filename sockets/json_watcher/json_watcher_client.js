#! /usr/bin/env node --harmony

"use strict";

const
  net = require('net'),
  netClient = net.connect({port: 5432}),

client.on('data', function(data) {
  // Read the JSON and catch parsing errors
  var message;
  try {
    message = JSON.parse(data);
  } catch (ex) {
    message = { type: "failed", err: ex.message }
  }

  // Parse the message
  if (message.type == 'watching') {
    console.log("Now watching " + message.file + " " + message.timestamp);
  } else if (message.type == 'change') {
    console.log(message.file + " changed. Event: " + message.event + ". Time: " + message.timestamp);
  } else if (message.type == 'failed') {
    console.log("Message did not parse properly: " + message.err);
  } else {
    throw Error("Unrecognized message type: " + message.type);
  }
});

client.on('end', function() {
  console.log("Disconnected from the remote server.");
});

client.on('error', function(err) {
  console.log("Error: " + err.message);
});
