var fs = require('fs'),
    sys = require('sys'),
    reader = require('./filereader'),
    http = require('http');

var httpOptions = {
  host: 'localhost',
  port: '8080',
  path: '/errors',
  method: 'POST'
};

function postRequest(line) {
  var req = http.request(httpOptions, function(res) {

    res.setEncoding('utf8');

    res.on('data', function(chunk) {
      console.log('BODY: ' + chunk);
    });
  });
  
  req.on('error', function(err) {
    console.log('Problem with request:' + err.message);
  });

  req.write(line + '\n');
  req.end();
};

function processLine(line) {
  var matches = line.match(/doHandle/);

  //if (! matches)
  //  return;

  postRequest(line);
}

process.stdin.resume();
reader.readLines(process.stdin, processLine);
