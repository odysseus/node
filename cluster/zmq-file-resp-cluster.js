#! /usr/bin/env node --harmony

'use strict';

const
cluster = require('cluster'),
fs = require('fs'),
zmq = require('zmq');

if (cluster.isMaster) {

  // Master process creates router and dealer sockets
  let
  router = zmq.socket('router').bind('tcp://127.0.0.1:5433'),
  dealer = zmq.socket('dealer').bind('ipc://file-dealer.ipc');

  // Forward messages between router and dealer
  router.on('message', function() {
    let frames = Array.prototype.slice.call(arguments);
    dealer.send(frames);
  });

  dealer.on('message', function() {
    let frames = Array.prototype.slice.call(arguments);
    router.send(frames);
  });

  // Listen for workers to come online
  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online.');
  });

  // Fork three workers
  for (let i = 0; i < 3; i++) {
    cluster.fork()
  }

} else {

  // Worker process - create REP socket, connect to DEALER
  let responder = zmq.socket('rep').connect('ipc://file-dealer.ipc');

  responder.on('message', function(data) {

    // Parse incoming message
    let request = JSON.parse(data);
    if (!request.path) {
      console.log(process.pid + " received invalid request - no path given");
      responder.send(JSON.stringify({
        status: -1,
        pid: process.pid,
        data: null,
        timestamp: Date.now()
      }));
    } else {
      console.log(process.pid + ' received request for: ' + request.path);

      // Read file and reply with content
      fs.readFile(request.path, function(err, data) {
        if (!err) {
          console.log(process.pid + ' sending response');
          responder.send(JSON.stringify({
            status: 0,
            pid: process.pid,
            data: data.toString(),
            timestamp: Date.now()
          }));
        } else {
          responder.send(JSON.stringify({
            status: -1,
            pid: process.pid,
            data: null,
            timestamp: Date.now()
          }));
        }
      });
    }
  });

}
