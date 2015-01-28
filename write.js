const fs = require('fs')

fs.writeFile('write.txt', 'Hello, world!\n', function (err) {
  if (err) {
    throw err;
  }
  console.log("File saved");
});
