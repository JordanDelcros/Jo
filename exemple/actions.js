// JUST TEST SPEED
Jo(function(){

	var bef = +new Date();
	var $container = Jo("#container");

	for( var howMuch = 0; howMuch < 1; howMuch++ ){
		Jo("<li/>")
			.addClass("jo")
			.insertEndTo($container)
			
	};

	var $li = Jo("li")
		.animate({
			// left: "10%",
			// top: "10%",
			transform: "rotateZ(185deg)",
			backgroundColor: "rgb(0, 255, 0)"
		}, {
			easing: "easeOutBounce",
			duration: 1000,
			complete: function(){
				console.log("jo finish");
			}
		});

	console.log("time: ", +new Date() - bef);

});

// var media;
// var peer;

// var isReady = function(){

// 	console.log("document is ready");

// 	// KEEP INTACT AFTER THIS LINE, TO FINISH

// 	socket = Jo.socket({
// 		url: "192.168.0.25:9000", //window.location.host + ":9000",
// 		open: function(){

// 			console.log("SOCKET IS OPEN");

// 		}
// 	});

// 	media = Jo.media({
// 		video: true,
// 		audio: false,
// 		success: function( src, stream ){

// 			Jo("video").item(0).attr("src", src).found[0].play();

// 			peer = $.peer({
// 				socket: socket,
// 				config: {
// 					iceServers: new Array()
// 				},
// 				stream: stream,
// 				addStream: function( src, stream ){

// 					console.log("NEW STREAM ADDED", src, stream);

// 					Jo("video").item(1).attr("src", src).found[0].play();

// 				}
// 			});

// 		},
// 		error: function( code ){

// 			console.log("fail", code);

// 		}
// 	});

// };


