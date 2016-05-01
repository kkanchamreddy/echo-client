var http = require('http');
var server = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(9000);

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
