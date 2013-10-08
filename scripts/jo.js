(function( window, undefined ){

	var regexp = /(\w+\s*\w*[^,])+/ig;

	var Jo = function( selector, context ){
		return new Jo.fn.init(selector, context);
	};

	Jo.fn = Jo.prototype = {
		Jo: "0.1",
		constructor: Jo,
		init: function( selector, context ){

			var found;

			if( !selector ) return this;

			if( typeof selector === "string" ){

				console.log( selector.split(/\s*,\s*/ig) );
			
			};

			return this;

		},
		each: function( data ){
			
			console.log(data);

			return this;

		}
	};

	Jo.fn.init.prototype = Jo.fn;

	if( typeof window === "object" && typeof window.document === "object" ) window.Jo = window.$ = Jo;

})( window );