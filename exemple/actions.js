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
	for( var howMuch = 0; howMuch < 1; howMuch++ ){
		Jo("<li/>")
			.insertEndTo($container)
			.animate({
				left: "0px"
			}, {
				easing: "easeInOutQuad",
				duration: 5000,
				complete: function(){
					console.log("jo finish");
				}
			});
	};
	console.log("jo", +new Date() - bef);
	// $container.empty();

	//jquery
	var bef = +new Date();
	var $container = jQuery("#container");
	for( var howMuch = 0; howMuch < 1; howMuch++ ){
		jQuery("<li/>")
			.appendTo($container)
			.animate({
				left: "0px"
			}, {
				// easing: "easeInOutQuad",
				duration: 5000,
				complete: function(){
					console.log("jq finish");
				}
			});
	};
	console.log("jquery", +new Date() - bef);
	// $container.html("");
};

function resize(){

	Jo("ul").css({
		width: "100%",
		height: $(window).height() + "px",
		backgroundColor: "rgba(0,0,0,0.5)"
	});

};

Jo(window)
	.on("resize ready", resize)
	.trigger("resize");

Jo(function( $ ){

	var $container = Jo("#container");
	var windowWidth = Jo(window).width();
	var windowHeight = Jo(window).height();

	// var bef = +new Date();
	// for( var howMuch = 0; howMuch < 100; howMuch++ ){

	// 	var $li = Jo("<li/>")
	// 		.insertEndTo($container)
	// 		.css({
	// 			top: "50%",
	// 			left: "50%"
	// 		}).animate({
	// 			left: Math.round((Math.random() * 100) + 1) + "%",
	// 			top: Math.round((Math.random() * 100) + 1) + "%"
	// 		}, {
	// 			duration: 5000,
	// 			easing: "easeOutElastic",
	// 			complete: function(){

	// 				$(this).remove();

	// 			}
	// 		});

	// };
	// console.log("jo", +new Date() - bef);

});

Jo(function( $ ){

	console.log("document is ready!");

});












/*
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

	for( var n = 0; n < 1000; n++ ){

		createNode();

	};

	$("ul li")
		.animate({
			top: (Math.floor(((Math.random() * window.innerHeight) + 1) / window.innerHeight * 100)) + "%",
			left: (Math.floor(((Math.random() * window.innerWidth) + 1) / window.innerWidth * 100)) + "%",
			// backgroundSize: "20px 20px",
			borderRadius: "30px",
			// transform: "rotate(180deg)"
		}, {
			name: "toto",
			duration: 3000,
			easing: "easeOutElastic",
			complete: function(){
				
				$(this)
					.animate({
						top: (Math.floor(((Math.random() * window.innerHeight) + 1) / window.innerHeight * 100)) + "%",
						left: (Math.floor(((Math.random() * window.innerWidth) + 1) / window.innerWidth * 100)) + "%"
					}, {
						name: "toto",
						duration: 10000,
						easing: "easeOutElastic",
						complete: function(){

							// console.log("complete", Date.now());
							
							// createNode();

						}
					});

			}
		});


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

	

// };


