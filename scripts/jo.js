(function( window, undefined ){

	var Jo = function( selector, context ){
		return new Jo.fn.init(selector, context);
	};

	Jo.fn = Jo.prototype = {
		Jo: "0.1",
		constructor: Jo,
		init: function( selector, context ){

			if( !selector ) return this;

			this.nodes = new Array();

			if( isString(selector) ){

				var nodes = document.querySelector(selector);

				for( var node = 0; node < nodes.length; node++ ){
					this.nodes.push(nodes[node]);
				};
			
			}
			else if( isObject(selector) ){

				this.nodes = [selector];

			};

			return this;

		},
		find: function( selector ){

			// this.each(function(){

				

			// });

			// var returned = Jo(this);

			// console.log( returned );

			// var nodes = this.nodes;

			// this.nodes = new Array();

			// for( var node = 0; node < nodes.length; node++ ){

			// 	console.log( nodes[node].querySelector("div > div") );

			// 	var founded = nodes[node].querySelectorAll(selector);

			// 	for( var found = 0; found < founded.length; found++ ){

			// 		this.nodes.push(founded[found]);
				
			// 	};


			// };

			return this;

		},
		each: function( fn ){

			for( var key = 0; key < this.nodes.length; key++ ){

				fn.apply(this.nodes[key], [key]);

			};

			return this;

		},
		css: function( styles, value ){

			if( isString(styles) ){

				return this.nodes[0].style[styles];

			}
			else if( isObject(styles) ){

				this.each(function(){

					for( var parameter in styles ) this.style[parameter] = styles[parameter];

				});

			};

			return this;

		},
		on: function( action, fn, useCapture ){

			if( isEmpty(window) ) useCapture = false;

			this.each(function(){

				this.addEventListener(action, fn, useCapture);

			});

			return this;

		},
		off: function( action, fn, useCapture ){

			if( isEmpty(window) ) useCapture = false;

			this.each(function(){

				this.removeEventListener(action, fn, useCapture);

			});

			return this;

		}
	};

	function isEmpty( source ){

		if( isObject(source) || isArray(source) ){
			
			for( var length in window ) return false;

			return true;

		}
		else if( source === undefined || source === null || source === "" ){
			return true;
		}
		else {
			return false;
		};

	};

	function isString( source ){

		if( source instanceof String || typeof source === "string" ){
			return true;
		}
		else {
			return false;
		};

	};

	function isObject( source ){

		if( source instanceof Object || typeof source === "object" ){
			return true;
		}
		else {
			return false;
		};

	};

	function isArray( source ){

		if( source instanceof Array || typeof source === "array" ){
			return true;
		}
		else {
			return false;
		};

	};

	Jo.infos = function(){

		console.log({
			Jo: "0.1",
			author: "Jordan Delcros",
			author_github: "JordanDelcros",
			author_website: "http://www.jordan-delcros.com"
		});

	};

	Jo.fn.init.prototype = Jo.fn;

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})( window );