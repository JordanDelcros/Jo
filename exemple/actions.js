// jQuery(function(){

// 	console.log("doc ready")

// 	var bef = +new Date();
// 	var $container = jQuery("#container");

// 	for( var howMuch = 0; howMuch < 1000; howMuch++ ){
// 		jQuery("<li/>")
// 			.appendTo($container)
// 			.animate({
// 				left: (Math.round(Math.random() * $(window).width()) + 1) + "px",
// 				top: (Math.round(Math.random() * $(window).height()) + 1) + "px",
// 				transform: "rotateZ(180deg)"
// 			}, {
// 				duration: 10000
// 			})
			
// 	};

// 	console.log("time: ", +new Date() - bef);

// });

var media;
var peer;

Jo(function(){

	console.log("document is ready");

	// KEEP INTACT AFTER THIS LINE, TO FINISH

	socket = Jo.socket({
		url: "192.168.23.182:9000", //window.location.host + ":9000",
		open: function(){

			console.log("SOCKET IS OPEN");

		}
	});

	media = Jo.media({
		video: true,
		audio: false,
		success: function( src, stream ){

			Jo("video").item(0).attr("src", src).found[0].play();

			peer = Jo.peer({
				socket: socket,
				config: {
					iceServers: new Array()
				},
				stream: stream,
				addStream: function( src, stream ){

					console.log("NEW STREAM ADDED", src, stream);

					Jo("video").item(1).attr("src", src).found[0].play();

				}
			});

		},
		error: function( code ){

			console.log("fail", code);

		}
	});

});