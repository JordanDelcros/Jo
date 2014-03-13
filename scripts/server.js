var webSocketServer = require("websocket").server;
var http = require("http");

var server = http.createServer(function( request, response ){

});

server.listen(9000);

var WSServer = new webSocketServer({
	httpServer: server
});

// ON CONNECTION
WSServer.on("request", function( request ){

	console.log("CONNECTION");
	var connection = request.accept(null, request.origin);

	// ON NEW MESSAGE
	connection.on("message", function( message ){

		// MESSAGE TYPE
		console.log(message.type);
		if( message.type === "utf8" ){

			var data = JSON.parse(message.utf8Data);

			// DATA FROM MESSAGE
			console.log(data);

			if( data.type === "pokemon" ){

				console.log("pokemon");

				connection.sendUTF(JSON.stringify({
					type: "pokemon",
					content: {
						hello: "world again"
					}
				}));

			};

		};

	});

	connection.on("close", function( connection ){
		console.log("CLOS SOCKET");
	});

});

console.log("SERVER NODE STARTED");