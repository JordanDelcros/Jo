var media;
var peer;

var isReady = function(){

	console.log("document is ready");

	var $ul = $("ul");

	var boxCount = 0;
	var $stat = $("div#stats");

	var createNode = function(){

		var $li = $("<li/>");

		$ul.insertEnd($li);

		$li
		.css({
			top: (Math.floor(((Math.random() * window.innerHeight) + 1) / window.innerHeight * 100)) + "%",
			left: (Math.floor(((Math.random() * window.innerWidth) + 1) / window.innerWidth * 100)) + "%"
		});

	};

	for( var n = 0; n < 300; n++ ){

		createNode();

	};

	$("ul li").each(function(){

		$(this).animate({
			top: (Math.floor(((Math.random() * window.innerHeight) + 1) / window.innerHeight * 100)) + "%",
			left: (Math.floor(((Math.random() * window.innerWidth) + 1) / window.innerWidth * 100)) + "%"
			// backgroundSize: "20px 20px",
			// borderRadius: "30%",
			// transform: "rotate(180deg)"
		}, {
			name: "toto",
			duration: 3000,
			easing: "easeOutElastic",
			complete: function(){

				console.log("complete", Date.now());
				
				$(this)
					.animate({
							top: (Math.floor(((Math.random() * window.innerHeight) + 1) / window.innerHeight * 100)) + "%",
							left: (Math.floor(((Math.random() * window.innerWidth) + 1) / window.innerWidth * 100)) + "%"
						}, {
							name: "toto",
							duration: 10000,
							easing: "easeOutElastic",
							complete: function(){

								console.log("complete", Date.now());
								
								// createNode();

							}
						});

			}
		})

	});
		// .animate({
		// 	top: 500 + "px",
		// 	left: 500 + "px"
		// }, {
		// 	// name: "toto",
		// 	duration: 2000,
		// 	easing: "easeOutElastic"
		// });

/*
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

	console.log('resize?');

*/

	$(window)
		.on("resize", resize)
		.trigger("resize");

};


Jo(document)
	.on("ready", isReady)
	// .off("ready", isReady);


Jo(function($){

	console.log("function (window) ready !");

});

function resize(){

	console.log("resize");

	$("ul").css({
		width: "100%",
		height: window.innerHeight + "px",
		backgroundColor: "rgba(0,0,0,0.5)"
	});

};