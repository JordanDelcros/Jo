var media;
var peer;

var isReady = function(){

	console.log("document is ready");

	var $ul = $("ul").css({
		width: "500px",
		height: "500px",
		backgroundColor: "rgba(0,0,0,0.5)"
	})

	var x = 0;

	for( var i = 0; i < 1000; i++ ){

		setTimeout(function(){

			var $li = $(document.createElement("li"));

			$ul.insertEnd($li);

			$li.css({
				position: "absolute",
				left: (parseInt($ul.css("width")) / 2 - parseInt($li.css("width")) / 2) + "px",
				top: (parseInt($ul.css("height")) / 2 - parseInt($li.css("height")) / 2) + "px"
			});

			x++;

			if( x > parseInt($ul.css("width")) ) x = 0;

			$li.animate({
				top: "0px",
				left: x + "px"
			}, {
				duration: 1000,
				easing: "easeOutBounce"
			});

		}, 500 * i );

	};
	

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