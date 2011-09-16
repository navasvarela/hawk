var http = require('http'),
    fs = require('fs'),
    logServer = require('./logserver'),
    webtailServer = require('./webtailserver');

var cwd = process.cwd();
var stream = fs.createWriteStream(cwd + "/cluster.log");

stream.once('open', function(fd) {
    logServer.start(stream);
    webtailServer.start(cwd);
});

