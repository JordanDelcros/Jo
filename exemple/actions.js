Jo(function( $ ){

	$("body")
		.empty()
		.insertEnd(
			$("<span/>").css({
				display: "block",
				width: "100px",
				height: "100px",
				backgroundColor: "black",
				left: "100px",
				top: "100px",
				border: "1px solid white"
			})
		)
		.find("span")
		.animate({
			left: "100pt",
			top: "100px",
			backgroundColor: "rgba(0,0,100,1)",
			borderColor: "rgba(0,0,100,1)",
			borderWidth: "20px",
			opacity: 0.5,
			transform: "rotateZ(180deg) scale(0.75)"
		}, {
			duration: 2000,
			easing: "easeOutElastic"
		});

});

/*
// jQuery(function(){

// 	console.log("doc ready")

// 	var bef = +new Date();
// 	var $container = jQuery("body");

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

// Jo(function(){

// 	console.log("doc ready")

// 	var bef = +new Date();
// 	var $container = Jo("body");

// 	for( var howMuch = 0; howMuch < 1000; howMuch++ ){
// 		Jo("<li/>")
// 			.insertEndTo($container)
// 			.animate({
// 				left: (Math.round(Math.random() * $(window).width()) + 1) + "px",
// 				top: (Math.round(Math.random() * $(window).height()) + 1) + "px",
// 				// transform: "rotateZ(180deg)"
// 			}, {
// 				duration: 5000
// 			})
			
// 	};

// 	console.log("time: ", +new Date() - bef);

// });

var media;
var peer;

window.MediaSource = (window.MediaSource || window.WebKitMediaSource);

Jo(function(){

	console.log("document is ready");

	// KEEP INTACT AFTER THIS LINE, TO FINISH

	socket = Jo.socket({
		url: "127.0.0.1:9000",
		open: function(){

			console.log("SOCKET IS OPEN");

		}
	});

	var localVideo = Jo("video").found[0];
	var remoteVideo = Jo("video").found[1];

	// Jo("input").on("change", function( event ){

	// 	var file = this.files[0];
	// 	var type = file.type;


	// 	if( localVideo.canPlayType(type) ){

	// 		var localStream = window.URL.createObjectURL(file);
	// 		localVideo.src = localStream;

	// 		var MediaSource = new window.MediaSource();

	// 		Jo.peer({
	// 			socket: socket,
	// 			stream: file,
	// 			addStream: function( src, stream ){

	// 				remoteVideo.src = src;
	// 				remoteVideo.play();

	// 			}
	// 		});

	// 	};

	// }, false);

	
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
*/