"use strict";

const
  fs = require('fs'),
  net = require('net'),

  filename = process.argv[2],

  server = net.createServer(function(conn) {

    // Reporting
    console.log('Subscriber connected');
    conn.write("Now watching '" + filename + "' for changes...\n");


    // Watcher setup
    let watcher = fs.watch(filename, function(event, name) {
      conn.write("File '" + name + "' modified - Event: " + event + " " + Date() + "\n");
    });

    // Cleanup
    conn.on('close', function() {
      console.log('Subscriber disconnected.');
      watcher.close();
    });

  });

if (!filename) {
  throw Error('No filename specified');
}

server.listen(5432, function() {
  console.log('Listening on port 5432');
});

