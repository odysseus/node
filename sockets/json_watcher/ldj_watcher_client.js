#! /usr/bin/env node --harmony

"use strict";

const
  ldj = require('./ldj.js'),
  net = require('net'),
  netClient = net.connect({port: 5432}),
  ldjClient = ldj.connect(netClient);

ldjClient.on('message', function(message) {
  if (message.type === 'watching') {
    console.log("Now watching: " + message.file + " " + message.timestamp);
  } else if (message.type === 'changed') {
    console.log(
      message.file + " changed. Event: " + message.event + ". Time: " + message.timestamp
    );
  } else {
    throw Error("Unrecognzied message type: " + message.type);
  }
});
