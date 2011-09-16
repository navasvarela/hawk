
var http = require('http'),
    fs = require('fs'),
    queryString = require('querystring'),
    url = require('url'),
    carrier = require('carrier'),
    spawn = require('child_process').spawn;

var cwd = process.cwd();

var tail_process = spawn('tail', ['-f', cwd + '/cluster.log'])

var logcarrier = carrier.carry(tail_process.stdout);

logcarrier.on('line', function(data) {
  var searchString = 'AnycastHandler';
  var regex = new RegExp(searchString, "i");

  var matches = data.toString().match(regex);

  if (matches) {
    console.log(matches);
  } else {
    console.log(data.toString() + " not matched with " + searchString);
  }
});

//tail_process.stdout.on('data', function(data) {
