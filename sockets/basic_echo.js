"use strict";
const
  net = require('net'),
  server = net.createServer(function(conn) {
    // Log the connection on the server
    console.log("Client connected: " + Date());

    // Inform the client of a successful connection
    conn.write("Connected\n");

    // After that, echo everything that is sent to it
    conn.pipe(conn);
  });

server.listen(5432);
