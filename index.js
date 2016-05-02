var http = require('http');
var express = require('express');
var app = express();

app.use(express.static('public'));

// create a server with the express app as a listener
var server = http.createServer(app).listen(9000);
///////////


var BinaryServer = require('binaryjs').BinaryServer,
	fs = require('fs');

// Create a BinaryServer attached to our existing server
var binaryserver = new BinaryServer({server: server, path: '/binary-endpoint'});

binaryserver.on('connection', function(client){
	// Incoming stream from browsers
	client.on('stream', function(stream, meta){
		var file = fs.createWriteStream(__dirname+ '/public/' + meta.name);
		stream.pipe(file);
	})
});
