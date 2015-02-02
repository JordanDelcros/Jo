Jo(function( $ ){

	$("body")
		.empty()
		.insertEnd("<span/>");

	test = $("span")
		.css({
			position: "absolute",
			display: "block",
			width: "100px",
			height: "100px",
			left: "50%",
			top: "50%",
			background: "red"
		})
		.animate({
			transform: "rotateZ(100deg)"
		},{
			duration: 3000,
			easing: "easeInOutQuad",
			onStep: function( step ){

				// console.log("rotate");

			}
		});

		setTimeout(function(){

			$("span").animate({
				transform: "rotateZ(20deg)"
			}, {
				duration: 10000,
				additional: false,
				easing: "easeInOutQuad",
				onStep: function(){

					// console.log( $.matrix($(this).css("transform")).getRotate().z );

				}
			});

		}.bind(this), 4000);

});

/*

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