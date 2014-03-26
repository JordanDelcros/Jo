var media;
var peer;

var isReady = function(){

	console.log("document is ready");

	$("header h1 abbr")
		.css({
			display: "block",
			position: "absolute",
			width: "10%",
			backgroundColor: "white"
		});

	var easings = ["linear", "easeOutQuad", "easeOutCubic", "easeOutQuart", "easeOutExpo", "easeOutCirc", "easeOutElastic", "easeOutBack", "easeOutBounce"];
	// var easings = ["linear", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeInSine", "easeOutSine", "easeInOutSine", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeInBack", "easeOutBack", "easeInOutBack", "easeInBounce", "easeOutBounce", "easeInOutBounce"];

	for( var easing = 0; easing < easings.length; easing++ ){

		var li = document.createElement("li");
		$("ul").insertEnd(li);

	};

	setTimeout(function(){

		for( var easing = 0; easing < easings.length; easing++ ){

			$("ul li")
				.item(easing)
				.animate({
					width: "50%",
					height: "50px",
					// backgroundSize: "10px 10px",
					backgroundColor: "rgba(10,100,255,0.5)"
				}, {
					duration: 1000,
					easing: easings[easing]
				});

		};
		
	}, 2000);

	// KEEP INTACT AFTER THIS LINE, TO FINISH

	var arr = ["a", "b", "c", "d"];

	arr.splice(2, 1);
	console.log(arr);

	socket = $.socket({
		url: "192.168.0.24:9000", //window.location.host + ":9000",
		open: function(){
			console.log("SOCKET IS OPEN");
		}
	});

	media = $.media({
		video: true,
		audio: false,
		success: function( src, stream ){

			Jo("video").item(0).attr("src", src).found[0].play();

			peer = $.peer({
				socket: socket,
				config: {
					iceServers: new Array()
				},
				stream: stream,
				addStream: function( src, stream ){

					Jo("video").item(1).attr("src", src).found[0].play();

				}
			});

		},
		error: function( code ){

			console.log("fail", code);

		}
	});

};


Jo(document)
	.on("ready", isReady)
	// .off("ready", isReady);


Jo(function($){

	console.log("function (window) ready !");

});