// Synchronus file reading does not require a callback
const
  fs = require('fs'),
  data = fs.readFileSync('target.txt');

process.stdout.write(data.toString());
