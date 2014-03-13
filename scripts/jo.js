/**
* @package Jo (JavaScript overloaded)
* @author Jordan Delcros <www.jordan-delcros.com>
*/
"use strict";
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

				if( new RegExp("^<.+>$", "gi").test(selector) ){

					var temporaryNode = document.createElement("div");

					temporaryNode.innerHTML = selector;

					for( var node = 0; node < temporaryNode.childNodes.length; node++ ){

						this.found.push(temporaryNode.childNodes[node]);

					};

					temporaryNode.remove();

				}
				else {

					this.found = getNodes(selector);

				};
			
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

			this.length = this.found.length;

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

						if( Jo(childs[child]).is(selector) ){

							found.push(childs[child]);

						};

					}
					else {

						found.push(childs[child]);

					};

				};

			});

			$this.found = found;
			$this.length = $this.found.length;

			return $this;

		},
		node: function( selector, normalize ){

			var $this = Jo(this);

			var found = new Array();

			if( isBoolean(selector) ){

				var normalize = selector;

				selector = undefined;

			};

			if( isEmpty(normalize) ){

				normalize = false;

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
			$this.length = $this.found.length;

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
		is: function( selector ){

			var returned = isEmpty(selector) ? false : true;

			if( isJo(selector) ){

				this.each(function( index ){

					if( this !== selector.found[index] ) returned = false;

				});

			}
			else if( isNode(selector) ){

				this.each(function(){

					if( this !== selector ) returned = false;

				});

			}
			else if( isNodeList(selector) ){

				this.each(function( index ){

					if( this !== selector[index] ) returned = false;

				});

			}
			else if( isString(selector) ){

				selector = prepareSelector(selector);

				this.each(function(){

					if( isFalse((this.matches || this.matchesSelector || this.msMatchesSelector || this.mozMatchesSelector || this.webkitMatchesSelector || this.oMatchesSelector).call(this, selector)) ){

						returned = false;

					};

				});
				
			};

			return returned;

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

					this.addEventListener(action, this.events[originalAction][f].fn, useCapture);

				}
				else if( isFunction(Jo.specialEvents[action]) && !Jo.support.events(action) ){

					var specialEvent = Jo.specialEvents[action].call(this, fn);

					evt.action = specialEvent.action;

					action = specialEvent.action;
					fn = specialEvent.fn;

					var f = this.events[originalAction].push(evt) - 1;

					this.addEventListener(action, this.events[originalAction][f].fn, useCapture);

				}
				else {

					var f = this.events[originalAction].push(evt) - 1;

					this.addEventListener(action, this.events[originalAction][f].fn, useCapture);
	
				};

			});

			return this;

		},
		off: function( action, fn, useCapture ){

			if( isBoolean(fn) ){

				useCapture = fn;
				fn = undefined;

			};

			if( isEmpty(useCapture) ){

				useCapture = false;

			};

			return this.each(function(){

				if( !isEmpty(this.events[action]) ){

					for( var i in this.events[action] ){

						if( isFunction(fn) && this.events[action][i].fn === fn ){

							this.removeEventListener(this.events[action][i].action, this.events[action][i].fn, useCapture);
							this.events[action].splice(i, 1);

						}
						else if( isEmpty(fn) ){

							this.removeEventListener(this.events[action][i].action, this.events[action][i].fn, useCapture);
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

				if( !isEmpty(value) ){

					this.each(function(){

						this.setAttribute(name, value);

					});

				}
				else {

					var returned = new Array();

					this.each(function(){

						returned.push(this.getAttribute(name));

					});

					return returned;

				};

			}
			else if( isArray(name) ){

				var returned = new Object();

				this.each(function(){

					for( var i in name ){

						if( isEmpty(returned[name[i]]) ){

							returned[name[i]] = new Array();

						};

						returned[name[i]].push(this.getAttribute(name[i]));

					};

				});

				return returned;

			}
			else if( isObject(name) ){
			
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

					var returned = new Array();

					this.each(function(){

						returned.push(window.getComputedStyle(this, null).getPropertyValue(name));

					});

					return returned;

				};

			}
			else if( isArray(name) ){

				var returned = Object();

				this.each(function(){

					for( var i in name ){

						if( isEmpty(returned[name[i]]) ){

							returned[name[i]] = new Array();

						};

						returned[name[i]].push(window.getComputedStyle(this, null).getPropertyValue(name));

					};

				});

				return returned;

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

			if( isEmpty(html) ){

				var returned = new Array();

				this.each(function(){

					returned.push(this.innerHTML);

				});

				return returned;

			}
			else {

				this.each(function(){

					this.innerHTML = html;

				});

				this.found = updateNodes(this);
				this.length = this.found.length;

				return this;

			};

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

					Jo(this).empty();

					if( Jo(this).is("text") ){

						this.nodeValue = text;

					}
					else {

						this.appendChild(document.createTextNode(text));
					}

				});

				this.found = updateNodes(this);
				this.length = this.found.length;

				return this;

			};

		},
		clone: function(){

			var found = new Array();

			this.each(function(){

				found.push(this.cloneNode(true));

			});

			this.found = found;
			this.length = this.found.length;

			return this;

		},
		insertBefore: function( html ){

			var $this = Jo(this);

			var found = new Array();

			if( isString(html) ){

				this.each(function(){

					if( this.insertAdjacentHTML ){

						this.insertAdjacentHTML("beforebegin", html);

					}
					else {

						var temporaryNode = document.createElement("div");

						temporaryNode.innerHTML = html;

						var nodes = temporaryNode.childNodes;

						temporaryNode.remove();

						for( var node = 0; node < nodes.length; node++ ){
						
							this.parentNode.insertBefore(nodes[node], this);

						};

					};

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.parentNode.insertBefore(html, this);

				});

			}
			else if( isNodeList(html) ){

				var length = html.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.parentNode.insertBefore(html[node], this);

					};

				});

			}
			else if( isJo(html) ){

				var length = html.found.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.parentNode.insertBefore(html.found[node], this);

					};

				});

			};

			return this;

		},
		insertToBefore: function( selector ){

			Jo(selector).insertBefore(this);

			return this;

		},
		insertAfter: function( html ){

			if( isString(html) ){

				this.each(function(){

					if( this.insertAdjacentHTML ){

						this.insertAdjacentHTML("afterend", html);

					}
					else {

						var temporaryNode = document.createElement("div");

						temporaryNode.innerHTML = html;

						var nodes = temporaryNode.childNodes;

						temporaryNode.remove();

						for( var node = 0; node < nodes.length; node++ ){

							this.parentNode.insertBefore(nodes[node], this.nextSibling);

						};

					};

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.parentNode.insertBefore(html, this.nextSibling);

				});

			}
			else if( isNodeList(html) ){

				var length = html.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.parentNode.insertBefore(html[node], this.nextSibling);

					};

				});

			}
			else if( isJo(html) ){

				var length = html.found.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.parentNode.insertBefore(html.found[node], this.nextSibling);

					};

				});

			};

			return this;

		},
		insertToAfter: function( selector ){

			Jo(selector).insertAfter(this);

			return this;

		},
		insertStart: function( html ){

			if( isString(html) ){
				
				this.each(function(){

					if( this.insertAdjacentHTML ){

						this.insertAdjacentHTML("afterbegin", html);

					}
					else {

						var temporaryNode = document.createElement("div");

						temporaryNode.innerHTML = html;

						var nodes = temporaryNode.childNodes;

						temporaryNode.remove();

						for( var node = 0; node < nodes.length; node++ ){

							this.insertBefore(nodes[node], this.firstChild);

						};

					};

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.insertBefore(html, this.firstChild);

				});

			}
			else if( isNodeList(html) ){

				var length = html.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.insertBefore(html[node], this.firstChild);

					};

				});

			}
			else if( isJo(html) ){

				var length = html.found.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.insertBefore(html.found[node], this.firstChild);

					};

				});

			};

			return this;

		},
		insertToStart: function( selector ){

			Jo(selector).insertStart(this);

			return this;

		},
		insertEnd: function( html ){

			if( isString(html) ){

				this.each(function(){

					if( this.insertAdjacentHTML ){

						this.insertAdjacentHTML("beforeend", html);

					}
					else {

						var temporaryNode = document.createElement("div");

						temporaryNode.innerHTML = html;

						var nodes = temporaryNode.childNodes;

						temporaryNode.remove();

						for( var node = 0; node < nodes.length; node++ ){

							this.parentNode.appendChild(nodes[node]);

						};

					};

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.appendChild(node);

				});

			}
			else if( isNodeList(html) ){

				var length = html.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.appendChild(nodes[node]);

					};

				});

			}
			else if( isJo(html) ){

				var length = html.found.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.appendChild(html.found[node]);

					};

				});

			};


			return this;

		},
		insertToEnd: function( selector ){

			Jo(selector).insertEnd(this);

			return this;

		},
		replace: function( html ){

			if( isEmpty(html) ){

				Jo(this).remove();

				this.found = new Array();
				this.length = this.found.length;

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

			}
			else if( isJo(html) ){

				html = html.found;

			};

			var nodes = new Array();

			for( var node = 0; node < html.length; node++ ){

				nodes.push(html[node]);

			};

			this.each(function(){

				for( var node = 0; node < html.length; node++ ){

					this.appendChild(html[node].cloneNode(true));

				};

			});

			this.found = updateNodes(this);
			this.length = this.found.length;

			return this;

		},
		remove: function(){

			this.each(function(){

				this.remove();

			});

			this.found = new Array();
			this.length = this.found.length;

			return this;

		},
		empty: function(){

			var newNodes = new Array();

			this.each(function(){

				while( this.firstChild ){

					Jo(this.firstChild).remove();

				};

			});

			return this;

		},
		show: function(){

			this.each(function(){

				if( !isEmpty(this.dataset.joDisplay) ){

					this.style.display = this.dataset.joDisplay;
					delete this.dataset.joDisplay;

				}
				else {

					this.style.display = "";

				};

			});

			return this;

		},
		hide: function(){


			this.each(function(){

				this.dataset.joDisplay = Jo(this).css("display");
				this.style.display = "none";

			});

			return this;

		}
	};

	Jo.fn.init.prototype = Jo.fn;

	Joot = Jo(document);

	function isEmpty( source ){

		if( (isObject(source) || isArray(source)) && !isFunction(source) ){

			for( var length in source ){

				return false;

			};

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

		return source instanceof Object && typeof source === "object";// && (source.constructor === Object ? true : false);

	};

	function isJSON( string ){

		try {

			JSON.parse(string);

		}
		catch( Exception ){

			return false

		};

		return true;

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

	function isChildOf( children, parent ){

		return parent.contains ? parent.contains(children) : !!(parent.compareDocumentPosition(children) & 16);

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

	function updateNodes( Jo ){

		var found = new Array();

		Jo.each(function(){

			if( document.contains(this) ){

				found.push(this)

			};

		});

		return found;

	};

	Jo.infos = function(){

		console.log({
			Jo: "0.1",
			author: "Jordan Delcros",
			author_github: "JordanDelcros",
			author_website: "http://www.jordan-delcros.com"
		});

	};

	Jo.merge = function( returned, hasOwnProperty ){


		if( isEmpty(returned) ){

			returned = new Object();

		};

		for( var i = 1; i < arguments.length; i++ ){

			for( var key in arguments[i] ){

				if( arguments[i].hasOwnProperty(key) ){

					if( isObject(arguments[i][key]) && (arguments[i][key].constructor === Object || arguments[i][key].constructor === Array) ){

						Jo.merge(returned[key], arguments[i][key]);

					}
					else {

						returned[key] = arguments[i][key];

					};

				};

			};

		};

		return returned;

	};

	Jo.extend = function( returned ){

		if( isEmpty(returned) ){

			returned = new Object();

		};

		for( var i = 1; i < arguments.length; i++ ){

			var obj = arguments[i];

			for( var key in obj ){

				if( obj.hasOwnProperty(key) ){

					if( isArray(obj) ){

						if( isArray(returned) ){

							if( returned.indexOf(obj[key]) < 0 ){

								returned.push(obj[key]);

							};

						}
						else if( isEmpty(returned[obj[key]]) ){

							returned[obj[key]] = null;

						};

					}
					else if( isObject(obj[key]) ){

						Jo.merge(returned[key], obj[key]);

					}
					else {

						returned[key] = obj[key];

					};

				};

			};

		};

		return returned;

	};

	Jo.ajax = function( settings ){

		settings = Jo.merge({
			method: "GET",
			async: true,
			type: "text/xml"
		}, settings);

		var data;

		if( settings.method === "POST" ){

			if( settings.data.constructor === FormData ){

				data = settings.data;

			}
			else if( isTag(settings.data) ){

				data = new FormData(settings.data);

			}
			else if( isJo(settings.data) ){

				if( settings.data.length === 1 ){

					data = new FormData(settings.data.found[0]);

				}
				else {

					data = new FormData();

					settings.data.find("[name]").each(function(){

						if( $(this).is("[type='file']") ){

							for( var file = 0; file < this.files.length; file++ ){

								data.append(this.getAttribute("name") + "[" + file + "]", this.files[file])

							};

						}
						else {

							data.append(this.getAttribute("name"), this.value);

						};

					});

				};

			}
			else if( isObject(settings.data) ){

				data = new FormData();

				for( var key in settings.data ){

					if( settings.data.hasOwnProperty(key) ){

						data.append(key, settings.data[key]);

					};

				};

			};

		}
		else if( settings.method === "GET" ){

			data = new Array();

			if( isJo(settings.data) || isTag(settings.data) ){

				Jo(settings.data).find("[name]").each(function(){

					data.push(encodeURIComponent(this.getAttribute("name")) + "=" + encodeURIComponent(this.value));

				});

			}
			else if( isObject(settings.data) ){

				for( var key in settings.data ){

					if( settings.data.hasOwnProperty(key) ){

						data.push(encodeURIComponent(key) + "=" + encodeURIComponent(settings.data[key]));

					};

				};

			};

			settings.url += "?" + data.join("&");

		};

		var request = new XMLHttpRequest();

		request.onreadystatechange = function(){

			if( this.readyState === 0 ){

				if( isFunction(settings.initialize) ){

					settings.initialize(this);

				};

			}
			else if( this.readyState === 1 ){

				if( isFunction(settings.open) ){

					settings.open(this);

				};

			}
			else if( this.readyState === 2 ){

				if( isFunction(settings.send) ){

					settings.send(this);

				};

			}
			else if( this.readyState === 3 ){

				if( isFunction(settings.receive) ){

					settings.receive(this);

				};

			}
			else if( this.readyState === 4 ){

				if( this.status >= 200 && this.status < 400 ){

					if( isFunction(settings.complete) ){

						settings.complete(this);

						delete this;

					};

				}
				else if( this.readyState >= 400 ){

					settings.error(this);

				};

			};

		};

		request.upload.onprogress = function( event ){

			settings.progress(event.loaded, event.total);

		};

		request.onerror = function(){

			settings.error(this);

		};

		request.onabort = function(){

			if( isFunction(settings.abort) ){

				settings.abort(this);

			};

		};

		request.open(settings.method, settings.url, settings.async);

		request.send(data);

		return request;

	};

	Jo.socket = function( settings ){

		return new Jo.socket.fn.init(settings);

	};

	Jo.socket.fn = Jo.socket.prototype = {
		constructor: Jo.socket,
		init: function( settings ){

			settings = Jo.merge({
				secure: false
			}, settings);

			this.events = new Object();

			this.socket = new WebSocket(settings.secure ? "wss://" : "ws://" + settings.url);

			this.socket.addEventListener("open", function(){

				if( isFunction(settings.open) ){

					settings.open();

				};

			}, false);

			this.socket.addEventListener("close", function(){

				if( isFunction(settings.close) ){

					settings.close();

				};

			}, false);

			this.socket.addEventListener("message", function( message ){

				var data;

				if( isJSON(message.data) ){

					data = JSON.parse(message.data);

				}
				else {

					data = message.data;

				};

				if( isFunction(settings.receive) ){

					settings.receive(data);

				};

				if( !isEmpty(data.type) && !isEmpty(this.events[data.type]) ){

					for( var fn in this.events[data.type] ){

						this.events[data.type][fn](data.content);

					};

				};

			}.bind(this), false);

			this.socket.addEventListener("error", function(){

				if( isFunction(settings.error) ){

					settings.error();

				};

			}, false);

			return this;

		},
		send: function( type, data ){

			setTimeout(function(){

				if( this.socket.readyState === 1 ){

					this.socket.send(JSON.stringify({
						type: type,
						content: data
					}));

				}
				else {


					this.send(type, data);

				};

			}.bind(this), 1);

			return this;

		},
		on: function( action, fn ){

			if( isEmpty(this.events[action]) ){

				this.events[action] = new Array();

			};

			this.events[action].push(fn);

			return this;

		},
		off: function( action, fn ){

			if( !isEmpty(fn) ){

				for( var f in this.events[action] ){

					if( this.events[action][f] === fn ){

						this.events[action].splice(f, 1);

					};

				};

			}
			else {

				delete this.events[action];

			};

			return this;

		},
		close: function( fn ){

			this.socket.close(1000, "closing socket");

			if( isFunction(fn) ){

				fn();

			};

			return this;

		}
	};

	Jo.socket.fn.init.prototype = Jo.socket.fn;

	Jo.blob = function( settings ){

		var blob = new Blob([], {
			type: "application/octet-binary"
		});

		var url = window.URL || window.webkitURL;

		url.createObjectURL(blob);

		// or this :

		var file = new FileReader();

		file.addEventListener("loadend", function(){

		}, false);

		file.readAsArrayBuffer(blob);

	};

	Jo.media = function( settings ){

		return new Jo.media.fn.init(settings);

	};

	Jo.media.fn = Jo.media.prototype = {
		constructor: Jo.media,
		init: function( settings ){

			navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

			settings = Jo.merge({
				video: true,
				audio: true
			}, settings);

			var media = navigator.getUserMedia({
				video: true,
				audio: true
			}, function( stream ){

				this.stream = stream;

				this.src = window.URL.createObjectURL(this.stream);

				settings.success.call(this, this.src, this.stream);

			}.bind(this), function( code ){

				settings.error.call(this);

			}.bind(this));

		},
		play: function(){

		},
		pause: function(){

		},
		stop: function(){

		}
	};

	Jo.media.fn.init.prototype = Jo.media.fn;

	Jo.peer = function( settings ){

		return new Jo.peer.fn.init( settings );

	};

	Jo.peer.fn = Jo.peer.prototype = {
		constructor: Jo.peer,
		init: function( settings ){

			settings = Jo.merge({
				config: {
					iceServers: new Array()
				}
			}, settings);

			window.RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.RTCPeerConnection;

			this.peer = new RTCPeerConnection(settings.config);

			this.sources = new Array();

			this.peer.addEventListener("icecandidate", function( event ){

				if( !isEmpty(event.candidate) ){

					console.log("ICE CANDIDATE", event);

					this.socket.send({
						type: "candidate",
						content: {
							sdpMLineIndex: event.candidate.sdpMLineIndex,
							sdpMid: event.candidate.sdpMid,
							candidate: event.candidate.candidate
						}
					})

				};

			}.bind(this), false);

			this.peer.addEventListener("addstream", function( event ){

				this.sources.push(window.URL.createObjectURL(event.stream));

				console.log("NEW SOURCE", this.sources[this.sources.length -1]);

			}, false);

			this.peer.addEventListener("removestream", function( event ){

				console.log("remove one stream");

			}, false);

			this.peer.createOffer(function( description ){

				this.peer.setLocalDescription(description);

			}.bind(this), function(){

			}.bind(this), function(){

			}.bind(this));

		},
		add: function( stream ){

			console.log("ADD STREAM");
			this.peer.addStream(stream);

		},
		remove: function(){

		}
	};

	Jo.peer.fn.init.prototype = Jo.peer.fn;

	Jo.worker = function( settings ){

		return new Jo.worker.fn.init(settings);

	};

	Jo.worker.fn = Jo.worker.prototype = {
		constructor: Jo.worker,
		init: function( settings ){

			settings = Jo.merge({

			}, settings);

			this.worker = new Worker(settings.url);

			this.events = new Object();

			this.worker.onmessage = function( message ){

				if( isFunction(settings.receive) ){

					settings.receive.call(this, message);

				};

				if( !isEmpty(message.data) && !isEmpty(message.data.type) ){

					for( var action in this.events ){

						if( this.events.hasOwnProperty(action) && action === message.data.type ){

							for( var evt in this.events[action] ){

								this.events[action][evt].call(this, message);

							};

						};

					};

				};

			}.bind(this);

			this.worker.onerror = function( message, file, line ){

				if( isFunction(settings.error) ){

					settings.error.call(this, message, file, line);

				};

			}.bind(this);

			return this;

		},
		send: function( type, data ){

			this.worker.postMessage({
				type: type,
				content: data
			});

			return this;

		},
		on: function( action, fn, useCapture ){

			if( isEmpty(useCapture) ){

				useCapture = false;

			};

			if( isEmpty(this.events[action]) ){

				this.events[action] = new Array();

			};

			this.events[action].push(fn);

			return this;

		},
		off: function( action, fn, useCapture ){

			if( isBoolean(fn) ){

				useCapture = fn;
				fn = undefined;

			};

			if( isEmpty(useCapture) ){

				useCapture = false;

			};

			if( !isEmpty(fn) ){

				for( var evt in this.events[action] ){

					if( this.events[action][evt] === fn ){

						this.events[action].splice(evt, 1);

					};

				};

			}
			else {

				delete this.events[action];

			};

			console.log(this.events);

			return this;

		},
		close: function( fn ){

			this.worker.terminate();
			
			if( isFunction(fn) ){

				fn.call(this);
				
			};
			
			return this;

		}
	};

	Jo.worker.fn.init.prototype = Jo.worker.fn;

	Jo.support = {

		events: function( event ){

			if( event in document || "on" + event in document ) return true;

			return false;

		}

	};

	Jo.specialTypes = {

		test: function( tagName ){


			for( var type in this.types ){

				if( this.types[type].indexOf(tagName) >= 0 ) return type;

			};

			return false;

		},
		types: {
			svg: new Array("svg", "rect")
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

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})(window);