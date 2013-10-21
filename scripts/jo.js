(function( window, undefined ){

	var Joot;

	var Jo = function( selector, context, Joot ){
		return new Jo.fn.init(selector, context, Joot);
	};

	Jo.fn = Jo.prototype = {
		Jo: "0.1",
		constructor: Jo,
		init: function( selector, context ){

			if( !selector ) return this;

			if( isFunction(selector) ){

				console.log(window);
				var oldOnLoad = window.onload;

				window.onload = function(){
					
					oldOnLoad.call(this);
					selector.call(this);

				};
				
			};

			this.nodes = new Array();

			if( isString(selector) ){

				this.nodes = getNodes(selector);
			
			}
			else if( isObject(selector) ){

				this.nodes = [selector];

			};

			return this;

		},
		onLoad: function( fn ){

			if( document.readyState === "complete" ){

				

			}
			else {

				document.addEventListener("DOMContentLoaded", complete, false);
				window.addEventListener("load", complete, false);

			};

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

			var returned = isEmpty(selector) ? false : true;

			selector = prepareSelector(selector).replace(/([#\.:\[])([^#\.:\[]+)/ig, function(all, type, curiosity){

				if( type === "." && curiosity.match(/\]$/ig) ){

					return all;

				};

				return "|" + all;

			}).split("|");

			this.each(function(){

				for( var key in selector ){

					// is tag
					if( selector[key].match(/^\w/i) ){

						if( selector[key].toLowerCase() !== this.tagName.toLowerCase() ) returned = false;

					}
					// is id
					else if( selector[key].match(/^#/) ){

						if( selector[key].substring(1) !== this.id ) returned = false;

					}
					// is class
					else if( selector[key].match(/^\./) ){

						if( this.classList.contains(selector[key].substring(1)) === false ) returned = false;

					}
					// is attr
					else if( selector[key].match(/^\[/) ){

						var attribute = selector[key].substring(1).slice(0,-1).split("=");

						if( isEmpty(this.attributes.getNamedItem(attribute[0])) ){

							returned = false

						}
						else {

							if( this.attributes.getNamedItem(attribute[0]).nodeValue !== attribute[1] ) returned = false;

						};	

					}
					// is pseudo
					else if( selector[key].match(/^:/) ){

						if( selector[key] === ":first-child" ){

							if( this.parentNode.firstElementChild !== this ) returned = false;

						}
						else if( selector[key] === ":last-child" ){

							console.log("last");

							//here

							console.log( this.parentNode.lastElementChild, this );
							if( this.parentNode.lastElementChild !== this ) returned = false;

						}
						else if( selector[key].match(/^:nth-child?\([^\)]+\)$/ig) ){

							var toFound = this;
							var $NodeList = $(this.parentNode).find("> *" + selector[key]);

							var found = false;

							$NodeList.each(function(){

								if( this === toFound ) found = true;

							});

							if( found === false ) returned = false;

						}
						else if( selector[key] === ":first-of-type" ){
							console.log("last of type dude")
							// of-type


						}
						else if( selector[key] === ":last-of-type" ){
							console.log("last of type dude")
							// of-type
							console.log("Jo in", Jo(this.parentNode).find(">div:last-of-type") )
						};

					};
				
				};

			});

			return returned;

		}
	};

	Joot = Jo(document);

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

	function isFunction( source ){

		if( source instanceof Function || typeof source === "function" ){
			return true;
		}
		else {
			return false;
		};

	};

	function isJo( source ){

		if( source instanceof Jo && typeof source === "object" ){
			return true;
		}
		else {
			return false;
		};

	};

	function prepareSelector( selector ){

		var returned = selector.replace(/\s+/ig, " ").split(",");

		for( var key = 0; key < returned.length; key++ ){

			returned[key] = returned[key].split(/\s/ig);

			for( var subkey = 0; subkey < returned[key].length; subkey++ ){

				returned[key][subkey] = returned[key][subkey].replace(/([#\.:\[])([^#\.:\[\|\>]+)/ig, function(all, type, curiosity){

					if( type === "." && curiosity.match(/\]$/ig) ) return all;
					return "|" + all;

				}).split("|");

				for( var lastkey = 0; lastkey < returned[key][subkey].length; lastkey++ ){

					returned[key][subkey][lastkey] = returned[key][subkey][lastkey].replace(/^:(first|last|nth|only)(-child|-of-type)?(\([0-9n\+\-]+\))?/ig, function(all, target, type, number){

						return ":" + target + (isEmpty(type) ? "-child" : type) + (isEmpty(number) ? "" : number);

					});

				};

				returned[key][subkey] = returned[key][subkey].join("");

			};

			returned[key] = returned[key].join(" ");

		};

		return returned.join(",");

	};

	function getNodes( selector, origin ){	

		selector = prepareSelector(selector);

		if( isEmpty(origin) ) origin = document;

		var returned = new Array();
		var originId = origin.id ? origin.id : null;
		var removeIdAfter = false;
		var oldOrigin = origin;

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