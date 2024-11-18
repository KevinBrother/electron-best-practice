const http = require('http');
const fs = require('fs');
const path = require('path');
const documentRoot = path.resolve(__dirname, '..', './release');

const server = http.createServer(function (req, res) {
  const url = req.url;

  const file = documentRoot + url;

  console.log(file);

  fs.readFile(file, function (err, data) {
    if (err) {
      res.writeHead(500, err);
    } else {
      // if (url.includes('.exe')) {
      //   res.writeHead(200, { 'Content-Type': 'text/html;charset="utf-8"' });
      // } else {
      //   res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      // }
      res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
      res.write(data);
      res.end();
    }
  });
});

server.listen(8080);

console.log('listening on http://localhost:8080');
