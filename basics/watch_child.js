#! /usr/bin/env node --harmony
"use strict";

const
  fs = require('fs'),
  spawn = require('child_process').spawn,
  filename = process.argv[2];

if (!filename) {
  throw Error("A file to watch must be specified");
}

fs.watch(filename, function(event, file) {
  let
    ls = spawn('ls', ['-lh', filename]),
    output = '';

  ls.stdout.on('data', function(data){
    output += data.toString();
  });

  ls.stderr.on('data', function(err){
    console.log("Error: " + err.message);
  });

  ls.on('close', function(){
    process.stdout.write(output)
  });
});

console.log("Now watching " + filename + " for changes...");

