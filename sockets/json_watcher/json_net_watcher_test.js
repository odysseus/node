// Sends a data string in two separate pieces
"use strict";
const
  net = require('net'),
  server = net.createServer(function(conn) {

    console.log('Subscriber connected');

    // Send the first chunk immediately
    conn.write('{ "type": "changed", "file": "targ');

    // Wait one second and send the second chunk
    let timer = setTimeout(function() {
      conn.write('et.xt, "timestamp":1358175758495}' + "\n");
      conn.end();
    }, 1000);

    // Clear the timer when the connection ends
    conn.on('end', function() {
      clearTimeout(timer);
      console.log('Subscriber disconnected');
    });
  });

server.listen(5432, function() {
  console.log("Listening on 5432...");
});
