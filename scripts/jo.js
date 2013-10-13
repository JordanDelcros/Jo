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

				var nodes = document.querySelectorAll(selector);

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

			var newNodes = new Array();

			this.each(function(){

				var nodes = this.querySelectorAll(selector);

				var array = new Array();

				for( var node = 0; node < nodes.length; node++ ){

					if( newNodes.indexOf(nodes[node]) < 0  ) array.push(nodes[node]);

				};

				newNodes = newNodes.concat(array);
	
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

	function isNodeDescandant( target, parent ){

		if( isEmpty(target) || isEmpty(parent) ) return false;

		var targetParent = target.parentNode;

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

		events: function( action ){

			if( "on" + action in document ) return true;

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

				if( isNodeDescandant(event.target, this) || isNodeDescandant(relTarget, this) ) return false;

				fn.call(this);

			}

			return returned;

		}

	};

	Jo.fn.init.prototype = Jo.fn;

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})( window );