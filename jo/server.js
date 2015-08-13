#!/usr/bin/env node

var webSocketServer = require("websocket").server;
var http = require("http");

var server = http.createServer(function( request, response ){

});

server.listen(9000);

var WSServer = new webSocketServer({
	httpServer: server
});

var users = new Object();

// ON CONNECTION
WSServer.on("request", function( request ){

	console.log("CONNECTION");
	var connection = request.accept(null, request.origin);

	var id = 0;

	for( var user in users ){

		if( users.hasOwnProperty(user) ){
		
			id++;
		
		};

	};

	users[id] = {
		name: users.length,
		connection: connection
	};

	console.log("ID is " + id);

	// ON NEW MESSAGE
	connection.on("message", function( message ){

		// MESSAGE TYPE
		if( message.type === "utf8" ){

			var data = JSON.parse(message.utf8Data);

			// DATA FROM MESSAGE

			console.log("MASTER GET TYPE", data.type);

			if( data.type === "offer" ){

				console.log("OFFER")

				users[id].description = data.content;

				for( var user in users ){

					if( users.hasOwnProperty(user) && user != id ){

						console.log("send offer to ", user);

						users[user].connection.sendUTF(JSON.stringify({
							type: "offer",
							content: data.content
						}));

					};
				};
			}
			else if( data.type === "answer" ){

				console.log("ANSWER");

				for( var user in users ){

					if( users.hasOwnProperty(user) && user != id ){

						console.log("send answer to ", user);

						users[user].connection.sendUTF(JSON.stringify({
							type: "answer",
							content: data.content
						}));

					};
				};

			}
			else if( data.type === "candidate" ){

				console.log("CANDIDATE")

				for( var user in users ){

					if( users.hasOwnProperty(user) && user != id ){

						// console.log("send candidate to ", user);

						users[user].connection.sendUTF(JSON.stringify({
							type: "candidate",
							content: data.content
						}));

					};
				};
			};
		};
	});

	connection.on("close", function( connection ){
		
		delete users[id];

	});

});

console.log("LOCAL NODE SERVER STARTED");