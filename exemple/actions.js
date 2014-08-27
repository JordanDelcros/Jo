// JUST TEST SPEED
window.onload = function(){
	//pure js
	// var bef = +new Date();
	// var container = document.querySelector("#container");
	// for( var howMuch = 0; howMuch < 10; howMuch++ ){
	// 	var li = document.createElement("li");
	// 	container.appendChild(li);
	// 	li.appendChild(document.createElement("ul"))
	// };
	// console.log("pure", +new Date - bef);
	// container.innerHTML = "";

	//jo
	var bef = +new Date();
	var $container = Jo("#container");
	for( var howMuch = 0; howMuch < 2; howMuch++ ){
		Jo("<li/>")
			.addClass("jo")
			.insertEndTo($container)
			.animate({
				transform: "rotateZ(45deg)"
			}, {
				easing: "easeOutElastic",
				duration: 2000,
				complete: function(){
					console.log("jo finish");
				}
			});
	};
	console.log("jo", +new Date() - bef);

	// $container.empty();

	//jquery
	// var bef = +new Date();
	// var $container = jQuery("#container");
	// for( var howMuch = 0; howMuch < 1; howMuch++ ){
	// 	jQuery("<li/>")
	// 		.addClass("jq")
	// 		.appendTo($container)
	// 		.animate({
	// 			left: "0px",
	// 			top: "300px"
	// 		}, {
	// 			// easing: "easeInOutQuad",
	// 			duration: 5000,
	// 			complete: function(){
	// 				console.log("jq finish");
	// 			}
	// 		});
	// };
	// console.log("jquery", +new Date() - bef);
	// $container.html("");
};

Jo(function( $ ){

	isReady();

});

var media;
var peer;

var isReady = function(){

	console.log("document is ready");

	// KEEP INTACT AFTER THIS LINE, TO FINISH

	socket = Jo.socket({
		url: "192.168.0.25:9000", //window.location.host + ":9000",
		open: function(){

			console.log("SOCKET IS OPEN");

		}
	});

	media = Jo.media({
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

					console.log("NEW STREAM ADDED", src, stream);

					Jo("video").item(1).attr("src", src).found[0].play();

				}
			});

		},
		error: function( code ){

			console.log("fail", code);

		}
	});

};


