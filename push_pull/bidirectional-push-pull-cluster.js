#! /usr/bin/env node --harmony

'use strict';

const
  cluster = require('cluster'),
  fs = require('fs'),
  zmq = require('zmq'),
  workers = 10,
  jobs = 100;

if (cluster.isMaster) {
  console.log("Master online");

  let
    push = zmq.socket('push').bind('ipc://push-master.ipc'),
    pull = zmq.socket('pull').bind('ipc://pull-master.ipc'),
    ready_count = 0;

  // Sends 30 jobs down the pipeline once the cluster is online
  let send_jobs = function() {
    for (let i=1; i<=jobs; i++) {
      push.send(JSON.stringify({
        type: 'job',
        arg: i
      }));
    }
  }

  // Pull receieves two messages: 'ready' when each cluster worker
  // initializes, and 'result' when it responds to a job
  pull.on('message', function(data) {
    let message = JSON.parse(data.toString());

    if (message.type == "ready") {
      console.log(message.pid + " is online");
      ready_count++;
      if (ready_count == workers) {
        send_jobs();
      }
    } else if (message.type == "result") {
      console.log(message.pid + " returned " + message.result);
    }
  });

  // Create the cluster
  for (let i=0; i<workers; i++) {
    cluster.fork();
  }

  process.on('SIGINT', function() {
    console.log("Process interrupted");
    push.close();
    pull.close();
  });

  process.on('SIGTERM', function() {
    console.log("Process terminated");
    push.close();
    pull.close();
  });

} else {

  // Each forked process has a push and pull socket to the master
  let
    push = zmq.socket('push').connect('ipc://pull-master.ipc'),
    pull = zmq.socket('pull').connect('ipc://push-master.ipc');

  // Ready signal ensures jobs begin only once the entire cluster
  // has initialized.
  // All response packets should include the pid of the sender
  // and the type of the message
  push.send(JSON.stringify({
    type: 'ready',
    pid: process.pid
  }));


  // The 'Job' of this example simply echoes the argument
  pull.on('message', function(data) {
    let message = JSON.parse(data.toString());

    if (message.type == 'job') {
      push.send(JSON.stringify({
        type: 'result',
        pid: process.pid,
        result: message.arg
      }));
    }
  });

}
