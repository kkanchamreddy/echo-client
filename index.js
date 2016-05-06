var http = require('http');
var express = require('express');
var app = express();
var wav = require('wav');

app.use(express.static('public'));
//app.listen(3000);

// create a server with the express app as a listener
var server = http.createServer(app).listen(9000);
///////////


var BinaryServer = require('binaryjs').BinaryServer,
	fs = require('fs');

// Create a BinaryServer attached to our existing server
var binaryserver = new BinaryServer({server: server, path: '/binary-endpoint'});

binaryserver.on('connection', function(client){
	var fileWriter = new wav.FileWriter('demo1.wav', {
		channels: 1,
		sampleRate: 48000,
		bitDepth: 16
	 });

	// Incoming stream from browsers
	client.on('stream', function(stream, meta){
		console.log('new stream');

		stream.pipe(fileWriter);
		stream.on('end', function() {
			fileWriter.end();
			console.log('wrote to file demo1.wav' );
		});
	})
});
