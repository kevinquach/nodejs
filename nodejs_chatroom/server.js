var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');

var cache = {};

function send404(res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('Error 404: resource not found!');
  res.end();
}

function sendFile(res, filePath, fileContents) {
  res.writeHead(
    200,
    {'Content-Type': mime.lookup(path.basename(filePath))}
  );
  res.end(fileContents);
}

function serveStatic(res, cache, absPath) {
  if (cache[absPath]) { // check cache first
    sendFile(res, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function(exists) {
      if (exists) { // check if file exists 
        fs.readFile(absPath, function(err, data) {
          if (err) {
            send404(res);
          } else {
            cache[absPath] = data; // cache data
            sendFile(res, absPath, data);
          }
        });
      } else {
        send404(res);
      }
    });
  }
}

// create HTTP server with anon fn as arg to createServer
// to handle res and req
var server = http.createServer(function(req, res) {
  var filePath = false;

  if(req.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + req.url;
  }

  var absPath = './' + filePath;
  serveStatic(res, cache, absPath);
});

// start server
server.listen(3000, function() {
  console.log("Server listening on port 3000.");
});


