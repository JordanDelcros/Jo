var test = "heyyo";

postMessage(test);

onmessage = function( data ){

	console.log("worker", data);

};