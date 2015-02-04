'use strict';

const
  zmq = require('zmq'),
  pusher = zmq.socket('push');

// Wait until the pullers are connected and ready
// then send 100 jobs

for (let i=0; i<100; i++) {
  pusher.send(JSON.stringify({
    a: i,
    b: i
  }));
}
