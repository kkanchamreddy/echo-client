var http = require('http');
var path = require('path');
var fs = require("fs");

var INDEX_FILE = path.normalize('./public/index.html');

var server = http.createServer(function (request, response) {
	if(request.url === "/index"){
		fs.readFile(INDEX_FILE, function (err, data) {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write(data);
			response.end();
		});
	} else{
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.write('<b>Hey there!</b><br /><br />This is the default response. Requested URL is: ' + request.url);
		response.end();
	}
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
