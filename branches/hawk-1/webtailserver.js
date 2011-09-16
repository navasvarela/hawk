var http = require('http'),
    spawn = require('child_process').spawn,
    carrier = require('carrier'),
    queryString = require('querystring'),
    url = require('url');

function start(cwd) {
  var server = http.createServer(function(request, response) {

      var queryParams = queryString.parse(url.parse(request.url).query);
      var searchString = queryParams.search;
      var regex = new RegExp(searchString, "i");

      console.log("yay...new connection to webtail with search string:" + regex);

      response.writeHead(200, {
        'Content-Type': 'text/plain'
        });

      var tail_process = spawn('tail', ['-f', cwd + '/cluster.log'])

      var logCarrier = carrier.carry(tail_process.stdout);

      request.connection.on('end', function() {
        tail_process.kill();
        });

      logCarrier.on('line', function(data) {
        var matches = data.toString().match(regex);
        if (matches) {
          response.write(data + '\n');
        }
      });
  });


  server.listen(3000);
  console.log("webtail server started on port 3000");
};

module.exports = {
  start: start
};
