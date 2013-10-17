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

				this.nodes = getNodes(selector);
			
			}
			else if( isObject(selector) ){

				this.nodes = [selector];

			};

			return this;

		},
		find: function( selector ){

			var newNodes = new Array();

			this.each(function(){

				newNodes = newNodes.concat(getNodes(selector, this));
	
			});

			this.nodes = newNodes;

			return this;

		},
		each: function( fn ){

			for( var key = 0; key < this.nodes.length; key++ ){

				fn.apply(this.nodes[key], [key]);

			};

			return this;

		},
		on: function( action, fn, useCapture ){


			if( isEmpty(useCapture) ) useCapture = false;


			this.each(function(){
				
				if( Jo.specialEvents[action] && !Jo.support.events(action) ){

					var newEvent = Jo.specialEvents[action](fn);

					action = newEvent.name;
					fn = newEvent.fn;

				};

				this.addEventListener(action, fn, useCapture);


			});

			return this;

		},
		off: function( action, fn, useCapture ){

			if( isEmpty(useCapture) ) useCapture = false;

			this.each(function(){

				this.removeEventListener(action, fn, useCapture);

			});

			return this;

		},
		attr: function( name, value ){


			if( isString(name) ){

				if( !isEmpty(value) ){

					this.each(function(){

						this.setAttribute(name, value);
						
					});

				}
				else {

					return this.nodes[0].style[name];

				};

			}
			else if( isObject(name) ){

			};

			return this;

		},
		css: function( name, value ){

			if( isString(name) ){

				if( !isEmpty(value) ){

					this.each(function(){

						this.style[name] = value;

					});

				}
				else {

					return this.nodes[0].style[name];

				};

			}
			else if( isObject(name) ){

				this.each(function(){

					for( var parameter in name ) this.style[parameter] = name[parameter];

				});

			};

			return this;

		},
		is: function( selector ){

			if( isEmpty(selector) ) return false;

			this.each(function(){

			});

			selector = selector.replace(/([#\.:\[])([^#\.:\[]+)/ig, function(all, type, curiosity){

				if( type === "." && curiosity.match(/\]$/ig) ){

					return all;

				};

				return "|" + all;

			}).split("|");

			console.log(this);

			for( var key in selector ){

				// is tag
				if( selector[key].match(/^\w/i) ){

					console.log("is tag ===", selector[key] )

				}
				// is id
				else if( selector[key].match(/^#/) ){

					console.log("is id ===", selector[key]);

				}
				// is class
				else if( selector[key].match(/^\./) ){

					console.log("is class ===", selector[key]);

				}
				// is attr
				else if( selector[key].match(/^\[/) ){

					console.log("is attr ===", selector[key])	

				}
				// is pseudo
				else if( selector[key].match(/^:/) ){

					console.log("is pseudo ===", selector[key] )

				};
			
			};


		}
	};

	function isEmpty( source ){

		if( isObject(source) || isArray(source) ){
			
			for( var length in source ) return false;

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

	function getNodes( selector, origin ){

		if( isEmpty(origin) ) origin = document;

		var returned = new Array();
		var originId = origin.id ? origin.id : null;
		var removeIdAfter = false;
		var oldOrigin = origin;

		selector = selector.replace(/:(first|last|nth|only|not)(-first-child|-last-child|-first-of-type|-last-of-type|-child|-of-type|-line|-letter)?(\(\w+\))?/ig, function(all, target, type, number){

			var returned = ":" + target;

			if( !isEmpty(type) && type.match(/^-first|-last$/ig) && !isEmpty(number) ) type += "-child";

			if( isEmpty(type) ) {
				returned += "-child";
			}
			else {
				returned += type;
			};

			if( !isEmpty(number) ) returned += number;

			return returned;

		});


		if( selector.match(/^\s*>/ig) ){

			if( isEmpty(originId) ){

				removeIdAfter = true;
				originId = origin.id = "Jo_" + Math.random().toString(36).substr(2,9) + new Date().getTime().toString(36);

			};

			selector = "#" + origin.id + selector;
			origin = document;

		};

		var nodes = origin.querySelectorAll(selector);

		if( removeIdAfter === true ) oldOrigin.removeAttribute("id");

		for( var node = 0; node < nodes.length; node++ ){
			returned.push(nodes[node]);
		};

		return returned;

	};

	function isChildOf( parent ){

		if( isEmpty(this) || isEmpty(parent) ) return false;

		var targetParent = this.parentNode;

		while( targetParent != null ){

			if( targetParent == parent ) return true;

			targetParent = targetParent.parentNode;

		};

		return false;

	};

	Jo.infos = function(){

		console.log({
			Jo: "0.1",
			author: "Jordan Delcros",
			author_github: "JordanDelcros",
			author_website: "http://www.jordan-delcros.com"
		});

	};

	Jo.support = {

		events: function( event ){

			if( "on" + event in document ) return true;

			return false;

		}

	};

	Jo.specialEvents = {

		mouseenter: function( fn ){

			return Jo.specialEvents.mousehover( "mouseover", fn );

		},
		mouseleave: function( fn ){

			return Jo.specialEvents.mousehover( "mouseout", fn );

		},
		mousehover: function( action, fn ){

			var returned = new Object();

			returned.name = action;

			returned.fn = function(){

				var relTarget = event.relatedTarget;

				if( isChildOf.call(event.target, this) || isChildOf.call(relTarget, this) ) return false;

				fn.call(this);

			};

			return returned;

		}

	};

	Jo.fn.init.prototype = Jo.fn;

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})( window );