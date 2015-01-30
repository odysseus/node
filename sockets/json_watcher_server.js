#! /usr/bin/env node --harmony

"use strict";

const
  net = require('net'),
  fs = require('fs'),
  watched = "./";

let connections = 0;

const server  = net.createServer(function(conn) {
  connections += 1;
  console.log(Date() + "Subscriber conncted. Total: " + connections);

  conn.write(JSON.stringify({action: "watching", file: watched}) + "\n");

  let watcher = fs.watch(watched, function(event, filename) {
    conn.write(JSON.stringify({
                              event: event,
                               file: filename,
                               time: Date()
                              })
                              + "\n");
  });

  conn.on('close', function() {
    connections -= 1;
    console.log(Date() + "Subscriber disconnected. Total: " + connections);
    watcher.close();
  });
});

server.listen(5432, function() {
  console.log("Listening on port 5432");
});
