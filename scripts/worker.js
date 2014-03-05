// importScripts("jo.js");
// Window do not exist in webworker

var test = "heyyo";

postMessage({
	type: "special",
	data: ["hey"]
});

onmessage = function( data ){

	console.log("worker !!!!!!");
	console.log(data);

	postMessage({
		type: "special",
		content: {
			hey: "dude",
			ima: "webworker !"
		} 
	})
	postMessage("COCORICO");


	postMessage("test")

};

// self.close();