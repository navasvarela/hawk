var http = require('http');

function start(stream) {

  var server = http.createServer(function(request, response) {

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    if (request.method != 'POST') {
      response.write("Can't do GET. Sorry");
      response.end();
      return;
    }

    switch(request.url) {
      case '/error':
          break;
      case '/info':
          break;
      case '/debug':
          break;
      default:
          console.log("Unknown url:" + request.url);
          return;
          break;
    };

    var logline = '';

    request.on('data', function(chunk) {
      logline += chunk.toString();
    });

    request.on('end', function() {
      stream.write(logline + '\n');
    });

    response.end();
  });

  server.listen(8080);
  console.log("LogServer started on port 8080");
};

module.exports = {
  start: start
}
