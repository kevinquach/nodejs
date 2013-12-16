require('colors');
var http = require('http');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<marquee>Hello World</marquee>');
}).listen(8080);

console.log('Server running on port 8080.'.rainbow);
