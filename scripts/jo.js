(function( window, undefined ){

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

				found = Jo.fn.parseSelector(selector);
			
			};

			return this;

		},
		parseSelector: function( selector ){

			selector = selector.replace(/\s*([<>:])\s*/ig, "$1");

			selector = selector.split(/\s*,\s*/ig);

			for( var key in selector ){

				var target = selector[key].split(/\s+/ig);

				console.log(target);

			};

		},
		each: function( data ){
			
			console.log(data);

			return this;

		}
	};

	Jo.fn.init.prototype = Jo.fn;

	if( typeof window === "object" && typeof window.document === "object" ) window.Jo = window.$ = Jo;

})( window );

// header h1, header h1 span, section, p 