'use strict';

const
  zmq = require('zmq'),
  puller = zmq.socket('pull');

// Connect to the pusher, announce readiness to work, then wait

puller.on('message', function(data) {
  let job = JSON.parse(data.toString());

  // Process the job
});
