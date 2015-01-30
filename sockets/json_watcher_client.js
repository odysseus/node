#! /usr/bin/env node --harmony

"use strict";

const
  net = require('net'),
  client = net.connect({port: 5432});

client.on('data', function(data) {
  let message = JSON.parse(data);
  if (message.type == 'watching') {
    console.log("Now watching " + message.file + " " + message.timestamp);
  } else if (message.type == 'change') {
    console.log(message.file + " changed. Event: " + message.event + ". Time: " + message.timestamp);
  } else {
    throw Error("Unrecognized message type: " + message.type);
  }
});
