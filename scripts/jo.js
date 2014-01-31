/**
* @package Jo (JavaScript overloaded)
* @author Jordan Delcros <www.jordan-delcros.com>
*/
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

				var oldOnLoad = window.onload;

				window.onload = function(){
					
					if( isFunction(oldOnLoad) ) oldOnLoad();

					selector.call(this, Jo);

				};
				
			};

			this.selector = selector;
			this.found = new Array();

			if( isString(selector) ){

				this.found = getNodes(selector);
			
			}
			else if( isNodeList(selector) ){

				for( var a = 0; a < selector.length; a++ ){

					this.found.push(selector[a]);

				};

			}
			else if( isNode(selector) ){

				this.found.push(selector);

			}
			else if( isJo(selector) ){

				this.found = selector.found;

			};

			return this;

		},
		find: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				found = found.concat(getNodes(selector, this));
	
			});

			$this.found = found;

			return $this;

		},
		child: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var childs = this.children;

				for( var child = 0; child < childs.length; child++ ){

					if( !isEmpty(selector) ){

						if( Jo(childs[child]).is(selector) ) found.push(childs[child]);

					}
					else {

						found.push(childs[child]);

					};

				};

			});

			$this.found = found;

			return $this;

		},
		node: function( selector, normalize ){

			var $this = Jo(this);

			var found = new Array();

			if( isBoolean(selector) ){

				var normalize = selector;

				selector = undefined;

			};

			if( isTrue(normalize) ){

				$this.each(function(){

					var nodes = this.childNodes;

					for( var node = 0; node < nodes.length; node++ ){

						if( isText(nodes[node]) && new RegExp("^\\s+$", "g").test(nodes[node].textContent) ){

							Jo(nodes[node]).remove();

						};

					};

				});

			};

			$this.each(function(){

				var nodes = this.childNodes;

				for( var node = 0; node < nodes.length; node++ ){

					if( !isEmpty(selector) && isString(selector) && Jo(nodes[node]).is(selector) ){

						found.push(nodes[node]);

					}
					else if( isEmpty(selector) ){

						found.push(nodes[node]);

					};

				};

			});

			$this.found = found;

			return $this;

		},
		item: function( number ){

			if( number <= this.found.length ){

				return Jo(this.found[number]);

			}
			else {

				return this;

			};

		},
		each: function( fn ){

			for( var key = 0; key < this.found.length; key++ ){

				fn.call(this.found[key], key);

			};
			
			return this;

		},
		on: function( action, fn, useCapture ){

			if( isEmpty(useCapture) ) useCapture = false;

			var originalAction = action;

			this.each(function(){

				if( !isObject(this.events) ) this.events = new Object();

				if( !isArray(this.events[originalAction]) ) this.events[originalAction] = new Array();

				var evt = {
					action: action,
					fn: fn
				};

				if( !isFunction(Jo.specialEvents[action]) && !Jo.support.events(action) ){

					var customEvent = new CustomEvent(action, {
						detail: {},
						bubbles: true,
						cancelable: true
					});

					evt.action = customEvent;

					var f = this.events[originalAction].push(evt) - 1;

					window.addEventListener ? this.addEventListener(action, this.events[originalAction][f].fn, useCapture) : this.attachEvent(action, fn, useCapture);

				}
				else if( isFunction(Jo.specialEvents[action]) && !Jo.support.events(action) ){

					var specialEvent = Jo.specialEvents[action].call(this, fn);

					evt.action = specialEvent.action;

					action = specialEvent.action;
					fn = specialEvent.fn;

					var f = this.events[originalAction].push(evt) - 1;

					window.addEventListener ? this.addEventListener(action, this.events[originalAction][f].fn, useCapture) : this.attachEvent("on" + action, fn, useCapture);

				}
				else {

					var f = this.events[originalAction].push(evt) - 1;

					window.addEventListener ? this.addEventListener(action, this.events[originalAction][f].fn, useCapture) : this.attachEvent("on" + action, fn, useCapture);
	
				};

			});

			return this;

		},
		off: function( action, fn, useCapture ){

			if( isBoolean(fn) ){

				useCapture = fn;
				fn = undefined;

			};

			if( isEmpty(useCapture) ) useCapture = false;

			return this.each(function(){

				if( !isEmpty(this.events[action]) ){

					for( var i in this.events[action] ){

						if( isFunction(fn) && this.events[action][i].fn === fn ){

							window.removeEventListener ? this.removeEventListener(this.events[action][i].action, this.events[action][i].fn, useCapture) : this.detachEvent("on" + action, this.events[action], useCapture);
							this.events[action].splice(i, 1);

						}
						else if( isEmpty(fn) ){

							window.removeEventListener ? this.removeEventListener(this.events[action][i].action, this.events[action][i].fn, useCapture) : this.detachEvent("on" + action, this.events[action], useCapture);
							this.events[action].splice(i, 1);

						};

					};

				};

			});

		},
		trigger: function( action ){

			return this.each(function( event ){

				if( !isEmpty(this.events) && !isEmpty(this.events[action]) ){

					if( !isFunction(Jo.specialEvents[action]) && !Jo.support.events(action) ){

						this.dispatchEvent(this.events[action].action);

					}
					else {

						for( var i in this.events[action] ){

							this.events[action][i].fn.call(this, event);

						};

					};

				};

			});

		},
		attr: function( name, value ){

			if( isString(name) && !isEmpty(value) ){

				parameter = name;

				name = new Object();

				name[parameter] = value;

			};

			if( isObject(name) ){
			
				for( var i in name ){

					this.each(function(){

						this.setAttribute(i, name[i]);

					});

				};

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

					return this.found[0].style[name];

				};

			}
			else if( isObject(name) ){

				this.each(function(){

					for( var parameter in name ) this.style[parameter] = name[parameter];

				});

			};

			return this;

		},
		addClass: function( className ){

			this.each(function(){

				this.classList.add(className);

			});

			return this;

		},
		removeClass: function( className ){

			this.each(function(){

				this.classList.remove(className);

			});

			return this;

		},
		html: function( html ){

			// Parse special html and append it to selected elements
			this.each(function(){

				this.innerHTML = "<b>test</b>";
				// console.log(this);

			});

			// insertAdjacentHTML();

			return this;

		},
		text: function( text ){

			if( isEmpty(text) ){

				var returned = new Array();

				this.each(function(){

					returned.push(this.textContent);

				});

				return returned;

			}
			else {

				this.each(function(){

					// Jo(this).empty();

					if( Jo(this).is("text") ){

						// this.nodeValue = text;

					}
					else {

						// this.appendChild(document.createTextNode(text));
					}

				});

			};


		},
		insertBefore: function( html ){

			var $this = Jo(this);

			var found = new Array();

			if( isString(html) ){

				this.each(function(){

					this.insertAdjacentHTML("beforebegin", html);

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.parentNode.insertBefore(html.cloneNode(true), this);

				});

			}
			else if( isNodeList(html) ){

				var length = html.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						console.log(html[node], node, length);

						this.parentNode.insertBefore(html[node].cloneNode(true), this);

					};

				});

			};

			return this;

		},
		insertAfter: function( html ){

			if( isString(html) ){

				this.each(function(){

					this.insertAdjacentHTML("afterend", html);

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.parentNode.insertBefore(html.cloneNode(true), this.nextSibling);

				});

			}
			else if( isNodeList(html) ){

				this.each(function(){

					for( var node = html.length-1; node >= 0; node-- ){

						this.parentNode.insertBefore(html[node].cloneNode(true), this.nextSibling);

					};

				});

			};

			return this;

		},
		insertStart: function( html ){

			if( isString(html) ){
				
				this.each(function(){

					this.insertAdjacentHTML("afterbegin", html);

				});

			}
			else if( isNode(html) ){



			};

			return this;

		},
		insertEnd: function( html ){

			this.each(function(){

				this.insertAdjacentHTML("beforeend", html);

			});

			return this;

		},
		replace: function( html ){

			var found = new Array();

			if( isEmpty(html) ){

				Jo(this).remove();

				this.found = new Array();

				return this;

			}
			else if( isString(html) ){

				var temporaryNode = document.createElement("div");
				temporaryNode.innerHTML = html;

				html = temporaryNode.childNodes;

				temporaryNode.remove();

			}
			else if( isNode(html) ){

				html = [html];

			};

			this.each(function(){

				var position = html[0];

				for( var node = html.length-1; node >= 0; node-- ){

					console.log("replace", html[node])

				};

			});

			this.found = found;

			return this;

		},
		remove: function(){

			this.each(function(){

				this.remove();

			});

			this.node = new Array();

			return this;

		},
		empty: function(){

			this.each(function(){

				while( this.firstChild ){

					Jo(this.firstChild).remove();

				};

			});

			return this;

		},
		is: function( selector ){

			var returned = isEmpty(selector) ? false : true;

			selector = prepareSelector(selector).replace(/([#\.:\[])([^#\.:\[]+)/ig, function(all, type, curiosity){

				if( type === "." && new RegExp("\]$", "ig").test(curiosity) ){

					return all;

				};

				return "|" + all;

			}).split("|");

			this.each(function(){

				for( var key in selector ){

					// is textNode
					if( selector[key] === "text" && !isText(this) ){

						returned = false;

					}
					// is tag
					else if( new RegExp("^\\w", "i").test(selector[key]) && (!isTag(this) || selector[key].toLowerCase() !== this.nodeName.toLowerCase()) ){

						returned = false;

					}
					// has id
					else if( new RegExp("^#", "g").test(selector[key]) && (!isTag(this) || selector[key].substring(1) !== this.id) ){

						returned = false;

					}
					// has class
					else if( new RegExp("^\\.", "g").test(selector[key]) && (!isTag(this) || isFalse(this.classList.contains(selector[key].substring(1)))) ){

						returned = false;

					}
					// has attr
					else if( new RegExp("^\\[", "g").test(selector[key]) ){

						var attribute = selector[key].substring(1).slice(0,-1).split("=");

						if( !isEmpty(attribute[1]) ){

							attribute[1] = attribute[1].replace(/^[\"\']/, "").replace(/[\"\']$/, "");

						};

						if( !isTag(this) || isEmpty(this.attributes.getNamedItem(attribute[0])) || (!isEmpty(attribute[1]) && this.attributes.getNamedItem(attribute[0]).nodeValue !== attribute[1]) ) returned = false;	

					}
					// is pseudo
					else if( new RegExp("^:", "g").test(selector[key]) ){

						if( selector[key] === ":first-child" && (!isTag(this) || !this.parentNode.firstElementChild.isEqualNode(this)) ){

							returned = false;

						}
						else if( selector[key] === ":last-child" && (!isTag(this) || this.parentNode.lastElementChild.isEqualNode(this)) ){

							returned = false;

						}
						else if( new RegExp("^:nth-child?\\([^\\)]+\\)$", "gi").test(selector[key]) ){

							var toFound = this;
							var $nodeList = Jo(this.parentNode).find("> *" + selector[key]);

							var found = false;

							$nodeList.each(function(){

								if( this.isEqualNode(toFound) ) found = true;

							});

							if( !isTag(this) || found === false ) returned = false;

						}
						else if( selector[key] === ":first-of-type" ){
							// first of which type ???
							if( Jo(this.parentNode).find(">:first-of-type").item(0).found[0] !== this ){

								returned = false;

							};

						}
						else if( selector[key] === ":last-of-type" ){

							if( Jo(this.parentNode).find(">:last-of-type").item(0).found[0] !== this ){

								returned = false;

							};

						}
						else if( new RegExp("^:nth-of-type?\\([^\\)]+\\)$", "gi").test(selector[key]) ){

							var toFound = this;
							var $NodeList = $(this.parentNode).find("> *" + selector[key]);

							var found = false;

							$NodeList.each(function(){

								if( this === toFound ) found = true;

							});

							if( found === false ) returned = false;

						}
						else {

							returned = false;

						};

					};
				
				};

			});

			return returned;

		},
		hide: function(){

			this.each(function(){

				this.style.display = "none";

			});

			return this;

		},
		show: function(){

			this.each(function(){

				this.style.display = "";

			});

			return this;

		}
	};

	Joot = Jo(document);

	function isEmpty( source ){

		if( (isObject(source) || isArray(source)) && !isFunction(source) ){
			
			for( var length in source ) return false;

			return true;

		}
		else {

			return source === undefined || source === null || source === "";

		};

	};

	function isString( source ){

		return source instanceof String || typeof source === "string";

	};

	function isObject( source ){

		return source instanceof Object || typeof source === "object";

	};

	function isArray( source ){

		return source instanceof Array || typeof source === "array";

	};

	function isNumber( source ){

		return typeof source === "number" || new RegExp("^[\\d\\.]+$", "gi").test(source) || (!isNaN(parseFloat(source)) && isFinite(source));

	};

	function isBoolean( source ){

		return typeof source === "boolean" || source === true || source === false;

	};

	function isTrue( source ){

		return source === true;

	};

	function isFalse( source ){

		return source === false;

	};

	function isFunction( source ){

		return source instanceof Function || typeof source === "function";

	};

	function isNode( source ){

		return source instanceof HTMLElement || source.nodeType;

	};

	function isTag( source ){

		return isNode(source) && source.nodeType === 1;

	};

	function isText( source ){

		return isNode(source) && source.nodeType === 3;

	};

	function isNodeList( source ){

		return source instanceof HTMLCollection || source instanceof NodeList;

	};

	function isJo( source ){

		return source instanceof Jo && typeof source === "object";

	};

	function prepareSelector( selector ){

		var returned = selector.replace(/\s+/ig, " ").split(",");

		for( var key = 0; key < returned.length; key++ ){

			returned[key] = returned[key].split(/\s/ig);

			for( var subkey = 0; subkey < returned[key].length; subkey++ ){

				returned[key][subkey] = returned[key][subkey].replace(/([#\.:\[])([^#\.:\[\|\>]+)/ig, function(all, type, curiosity){

					if( type === "." && new RegExp("\\]$", "ig").test(curiosity) ) return all;
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

		if( new RegExp("^\\s*>", "ig").test(selector) ){

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

	function getChilds( origin, selector ){



	};

	function isChildOf( children, parent ){

		return parent.contains ? parent.contains(children) : !!(parent.compareDocumentPosition(children) & 16);

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

			if( event in document || "on" + event in document ) return true;

			return false;

		}

	};

	Jo.specialEvents = {

		ready: function( fn ){

			if( document.readyState === "complete" ){

				fn();

			}
			else {

				return {
					action: "DOMContentLoaded",
					fn: fn
				};

			};

		},
		mouseenter: function( fn ){

			return {
				action: "mouseover",
				fn: Jo.specialEvents.mousehover(fn)
			};

		},
		mouseleave: function( fn ){

			return {
				action: "mouseout",
				fn: Jo.specialEvents.mousehover(fn)
			};

		},
		mousehover: function( fn ){

			return function( event ){

				var evt = event || window.event;

				var target = evt.target || evt.srcElement;
				var relatedTarget = evt.relatedTarget || evt.fromElement;

				if( (this === target || isChildOf(target, this)) && !isChildOf(relatedTarget, this) ){

					fn.call(this);

				}
				else {

					return false;

				};

			};

		}

	};

	Jo.fn.init.prototype = Jo.fn;

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})( window );