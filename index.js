var http = require('http');
var https = require('https');
var wav = require('wav');
var FILE = './public/demo.wav';

var app = require('./app.js');
var debug = require('debug')('companion:server');

var fs = require('fs');
var config = require("./config.js");


var port = normalizePort(process.env.PORT || '9000');
app.set('port', port);

/*
var options = {
	key: fs.readFileSync(config.sslKey),
	cert: fs.readFileSync(config.sslCert),
	ca: fs.readFileSync(config.sslCaCert),
	requestCert: true,
	rejectUnauthorized: false,
};
*/

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		// named pipe
		return val;
	}
	if (port >= 0) {
		// port number
		return port;
	}
	return false;
}

// create a server with the express app as a listener
var server = http.createServer(app).listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof port === 'string'
	? 'Pipe ' + port
	: 'Port ' + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
		throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string'
	? 'pipe ' + addr
	: 'port ' + addr.port;
	console.log('Listening on ' + bind);
}


var BinaryServer = require('binaryjs').BinaryServer;

// Create a BinaryServer attached to our existing server
var binaryserver = new BinaryServer({server: server, path: '/binary-endpoint'});

function getFileWriter() {
	return new wav.FileWriter(FILE, {
		channels: 1,
		sampleRate: 48000,
		bitDepth: 16
	 });
}

binaryserver.on('connection', function(client){

	// Incoming stream from browsers
	client.on('stream', function(stream, meta){
		var fileWriter = getFileWriter();

		stream.pipe(fileWriter);
		stream.on('end', function() {
			fileWriter.end();
			var file = fs.createReadStream(FILE);
			client.send(file);


		});
	})
});
