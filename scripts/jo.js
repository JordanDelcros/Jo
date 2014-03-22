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
		parent: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				if( !isEmpty(selector) ){

					if( Jo(this.parentNode).is(selector) ){

						found.push(this.parentNode);

					};

				}
				else {

					found.push(this.parentNode);

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
		prev: function(){

			var found = new Array();

			this.each(function(){

				if( this.previousElementSibling ){

					this.push(this.previousElementSibling);

				};

			});

			this.found = found;

			return this;

		},
		next: function(){

			var found = new Array();

			this.each(function(){

				if( this.nextElementSibling ){

					found.push(this.nextElementSibling);

				};

			});

			this.found = found;

			return this;

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
		css: function( property, value ){

			if( isString(property) ){

				if( !isEmpty(value) ){

					this.each(function(){

						this.style[property] = value;

					});

				}
				else {

					var returned = new Array();

					this.each(function(){

						returned.push(window.getComputedStyle(this, null).getPropertyValue(property));

					});

					return returned;

				};

			}
			else if( isArray(property) ){

				var returned = Object();

				this.each(function(){

					for( var i in property ){

						if( isEmpty(returned[property[i]]) ){

							returned[property[i]] = new Array();

						};

						returned[property[i]].push(window.getComputedStyle(this, null).getPropertyValue(property));

					};

				});

				return returned;

			}
			else if( isObject(property) ){

				this.each(function(){

					for( var parameter in property ) this.style[parameter] = property[parameter];

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

							this.parentNode.insertBefore(nodes[node], this.nextElementSibling);

						};

					};

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.parentNode.insertBefore(html, this.nextElementSibling);

				});

			}
			else if( isNodeList(html) ){

				var length = html.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.parentNode.insertBefore(html[node], this.nextElementSibling);

					};

				});

			}
			else if( isJo(html) ){

				var length = html.found.length;

				this.each(function(){

					for( var node = 0; node < length; node++ ){

						this.parentNode.insertBefore(html.found[node], this.nextElementSibling);

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

					this.appendChild(html);

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

		},
		animate: function( styles, options ){

			options = Jo.merge({
				duration: 1000,
				easing: "linear"
			}, options);

			this.each(function(){

				var $this = Jo(this);

				$this.animation = new Object();
				$this.animation.properties = new Object();

				for( var property in styles ){

					if( styles.hasOwnProperty(property) ){

						$this.animation.properties[property] = new Object();
						$this.animation.properties[property].from = $this.css(property)[0];
						$this.animation.properties[property].to = styles[property];

					};

				};

				$this.animation.fn = function( now ){

					if( isEmpty($this.animation.times.start) ){

						$this.animation.times.start = now;

					};

					$this.animation.times.elapsed = now - $this.animation.times.start;

					$this.animation.percentage = $this.animation.times.elapsed / options.duration * 100;

					if( $this.animation.percentage > 100 ){

						$this.animation.percentage = 100;

					};

					for( var property in $this.animation.properties ){

						if( $this.animation.properties.hasOwnProperty(property) ){

							var from = parseInt($this.animation.properties[property].from);
							var to = parseInt($this.animation.properties[property].to);

							var value = undefined;

							if( $this.animation.percentage === 100 ){

								value = this.style[property] = to + "px";

							}
							else {

								console.log("easing", Jo.easing[options.easing](null, $this.animation.times.elapsed, options.duration));

								this.style[property] = from + (Jo.easing[options.easing](null, $this.animation.times.elapsed, options.duration) * (to - from)) + "px";

							};

						};

					};

					if( $this.animation.percentage === 100 ){

						cancelAnimationFrame($this.animation.id);

					}
					else {

						$this.animation.id = requestAnimationFrame($this.animation.fn);

					};

				}.bind(this);

				$this.animation.times = new Object();

				requestAnimationFrame($this.animation.fn);

				return this;

			});

		}
	};

	Jo.fn.init.prototype = Jo.fn;

	Joot = Jo(document);

	Jo.easing = {
		linear: function( x, elapsed, duration ){

			return elapsed / duration * 1 % 1;

		},
		easeInQuad: function( x, elapsed, duration ){

			return 1 * (elapsed /= duration) * elapsed;

		},
		easeOutQuad: function( x, elapsed, duration ){

			return -1 * (elapsed /= duration) * (elapsed - 2);

		},
		easeInOutQuad: function( x, elapsed, duration ){

			if( (elapsed /= duration / 2) < 1 ){

				return 1 / 2 * elapsed * elapsed;

			}
			else {

				return -1 / 2 * ((--elapsed) * (elapsed - 2) - 1);

			};

		},
		easeInCubic: function( x, elapsed, duration ){

			return 1 * (elapsed /= duration) * elapsed * elapsed;

		},
		easeOutCubic: function( x, elapsed, duration ){

			return 1 * ((elapsed = elapsed / duration - 1) * elapsed * elapsed + 1);

		},
		easeInOutCubic: function( x, elapsed, duration ){

			if( (elapsed /= duration / 2) < 1 ){

				return 1 / 2 * elapsed * elapsed * elapsed;

			}
			else {

				return 1 / 2 * ((elapsed -= 2) * elapsed * elapsed + 2);

			};

		},
		easeInQuart: function( x, elapsed, duration ){

			return 1 * (elapsed /= duration) * elapsed * elapsed * elapsed;

		},
		easeOutQuart: function( x, elapsed, duration ){

			return -1 * ((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed - 1);

		},
		easeInOutQuart: function( x, elapsed, duration ){

			if( (elapsed /= duration / 2) < 1 ){

				return 1 / 2 * elapsed * elapsed * elapsed * elapsed;

			}
			else {

				return -1 / 2 * ((elapsed -= 2) * elapsed * elapsed * elapsed - 2);

			};

		},
		easeInQuint: function( x, elapsed, duration ){

			return 1 * (elapsed /= duration) * elapsed * elapsed * elapsed * elapsed;

		},
		easeOutQuint: function( x, elapsed, duration ){

			return 1 * ((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed * elapsed + 1);
	
		},
		easeInOutQuint: function( x, elapsed, duration ){

			if( (elapsed /= duration / 2) < 1 ){

				return 1 / 2 * elapsed * elapsed * elapsed * elapsed * elapsed;
			
			}
			else {

				return 1 / 2 * ((elapsed -= 2) * elapsed * elapsed * elapsed * elapsed + 2);

			};

		},
		easeInSine: function( x, elapsed, duration ){

			return -1 * Math.cos(elapsed / duration * (Math.PI / 2)) + 1;

		},
		easeOutSine: function( x, elapsed, from, to, duration ){

			return to * Math.sin(elapsed / duration * (Math.PI / 2)) + from;

		},
		easeInOutSine: function( x, elapsed, from, to, duration ){

			return -to / 2 * (Math.cos(Math.PI * elapsed / duration) - 1) + from;

		},
		easeInExpo: function( x, elapsed, from, to, duration ){

			return (elapsed == 0) ? from : to * Math.pow(2, 10 * (elapsed / duration - 1)) + from;

		},
		easeOutExpo: function( x, elapsed, from, to, duration ){

			return (elapsed == duration) ? from + to : to * (-Math.pow(2, -10 * elapsed / duration) + 1) + from;

		},
		easeInOutExpo: function( x, elapsed, from, to, duration ){

			if( elapsed == 0 ){

				return from;

			}
			else if( elapsed == duration ){

				return from + to;

			}
			else if( (elapsed /= duration / 2) < 1 ){

				return to / 2 * Math.pow(2, 10 * (elapsed - 1)) + from;

			}
			else {

				return to / 2 * (-Math.pow(2, -10 * --elapsed) + 2) + from;

			};

		},
		easeInCirc: function( x, elapsed, from, to, duration ){

			return -to * (Math.sqrt(1 - (elapsed /= duration) * elapsed) - 1) + from;

		},
		easeOutCirc: function( x, elapsed, from, to, duration ){

			return to * Math.sqrt(1 - (elapsed = elapsed / duration - 1) * elapsed) + from;

		},
		easeInOutCirc: function( x, elapsed, from, to, duration ){

			if( (elapsed /= duration / 2) < 1){

				return -to / 2 * (Math.sqrt(1 - elapsed * elapsed) - 1) + from;

			}
			else {

				return to / 2 * (Math.sqrt(1 - (elapsed -= 2) * elapsed) + 1) + from;

			};

		},
		easeInElastic: function( x, elapsed, duration ){

			var s = 1.70158;
			var p = 0;
			var a = 1;

			if( elapsed == 0 ){

				return 0;

			};

			if( (elapsed /= duration) == 1 ){

				return 1;

			};

			if( !p ){

				p = duration * 0.3;

			};

			if( a < Math.abs(1) ){

				a = 1;
				var s = p / 4;

			}
			else {

				var s = p / (2 * Math.PI) * Math.asin(1 / a);

			};

			return -(a * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin( (elapsed * duration - s) * (2 * Math.PI) / p));

		},
		// x:x   t:elapsed   b:from   c:to    d:duration
		easeOutElastic: function( x, elapsed, duration ){

			var s = 1.70158;
			var p = 0;
			var a = 1;

			if( elapsed == 0 ) return 0;

			if( (elapsed /= duration) == 1 ) return 1;

			if( !p ) p = duration * 0.3;

			if( a < Math.abs(1) ){

				a = 1;
				var s = p / 4;

			}
			else var s = p / (2 * Math.PI) * Math.asin(1 / a);

			return a * Math.pow(2, -10 * elapsed) * Math.sin( (elapsed * duration - s) * (2 * Math.PI) / p ) + 1;

		},
		easeInOutElastic: function( x, elapsed, from, to, duration ){

			var s=1.70158;var p=0;var a=c;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (a < Math.abs(c)) { a=c; var s=p/4; }
			else var s = p/(2*Math.PI) * Math.asin (c/a);
			if (now < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;

		},
		easeInBack: function (x, t, b, c, d, s) {

			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;

		},
		easeOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;

		},
		easeInOutBack: function (x, t, b, c, d, s) {
			if (s == undefined) s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;

		},
		easeInBounce: function( x, now, from, to, duration ){

			return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;

		},
		easeOutBounce: function( x, now, from, to, duration ){

			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}

		},
		easeInOutBounce: function( x, now, from, to, duration ){

			if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
			return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		
		}
	};


	//Jo.easing = {
	// 	linear: function( x, elapsed, from, to, duration ){
		
	// 		return from + (elapsed / duration * (to - from) % (to - from));

	// 	},
	// 	easeInQuad: function( x, elapsed, from, to, duration ){

	// 		return to * (elapsed /= duration) * elapsed + from;

	// 	},
	// 	easeOutQuad: function( x, elapsed, from, to, duration ){

	// 		return -to * (elapsed /= duration) * (elapsed - 2) + from;

	// 	},
	// 	easeInOutQuad: function( x, elapsed, from, to, duration ){

	// 		if( (elapsed /= duration / 2) < 1 ){

	// 			return to / 2 * elapsed * elapsed + from;

	// 		}
	// 		else {

	// 			return -to / 2 * ((--elapsed) * (elapsed - 2) - 1) + from;

	// 		};

	// 	},
	// 	easeInCubic: function( x, elapsed, from, to, duration ){

	// 		return to * (elapsed /= duration) * elapsed * elapsed + to;

	// 	},
	// 	easeOutCubic: function( x, elapsed, from, to, duration ){

	// 		return to * ((elapsed = elapsed / duration - 1) * elapsed * elapsed + 1) + from;

	// 	},
	// 	easeInOutCubic: function( x, elapsed, from, to, duration ){

	// 		if( (elapsed /= duration / 2) < 1 ){

	// 			return to / 2 * elapsed * elapsed * elapsed + from;

	// 		}
	// 		else {

	// 			return to / 2 * ((elapsed -= 2) * elapsed * elapsed + 2) + from;

	// 		};

	// 	},
	// 	easeInQuart: function( x, elapsed, from, to, duration ){

	// 		return to * (elapsed /= duration) * elapsed * elapsed * elapsed + to;

	// 	},
	// 	easeOutQuart: function( x, elapsed, from, to, duration ){

	// 		return -to * ((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed - 1) + from;

	// 	},
	// 	easeInOutQuart: function( x, elapsed, from, to, duration ){

	// 		if( (elapsed /= duration / 2) < 1 ){

	// 			return to / 2 * elapsed * elapsed * elapsed * elapsed + form;

	// 		}
	// 		else {

	// 			return -to / 2 * ((elapsed -= 2) * elapsed * elapsed * elapsed - 2) + from;

	// 		};

	// 	},
	// 	easeInQuint: function( x, elapsed, from, to, duration ){

	// 		return to * (elapsed /= duration) * elapsed * elapsed * elapsed * elapsed + from;

	// 	},
	// 	easeOutQuint: function( x, elapsed, from, to, duration ){

	// 		return to * ((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed * elapsed + 1) + from;
	
	// 	},
	// 	easeInOutQuint: function( x, elapsed, from, to, duration ){

	// 		if( (elapsed /= duration / 2) < 1 ){

	// 			return to / 2 * elapsed * elapsed * elapsed * elapsed * elapsed + from;
			
	// 		}
	// 		else {

	// 			return to / 2 * ((elapsed -= 2) * elapsed * elapsed * elapsed * elapsed + 2) + from;

	// 		};

	// 	},
	// 	easeInSine: function( x, elapsed, from, to, duration ){

	// 		return -to * Math.cos(elapsed / duration * (Math.PI / 2)) + to + from;

	// 	},
	// 	easeOutSine: function( x, elapsed, from, to, duration ){

	// 		return to * Math.sin(elapsed / duration * (Math.PI / 2)) + from;

	// 	},
	// 	easeInOutSine: function( x, elapsed, from, to, duration ){

	// 		return -to / 2 * (Math.cos(Math.PI * elapsed / duration) - 1) + from;

	// 	},
	// 	easeInExpo: function( x, elapsed, from, to, duration ){

	// 		return (elapsed == 0) ? from : to * Math.pow(2, 10 * (elapsed / duration - 1)) + from;

	// 	},
	// 	easeOutExpo: function( x, elapsed, from, to, duration ){

	// 		return (elapsed == duration) ? from + to : to * (-Math.pow(2, -10 * elapsed / duration) + 1) + from;

	// 	},
	// 	easeInOutExpo: function( x, elapsed, from, to, duration ){

	// 		if( elapsed == 0 ){

	// 			return from;

	// 		}
	// 		else if( elapsed == duration ){

	// 			return from + to;

	// 		}
	// 		else if( (elapsed /= duration / 2) < 1 ){

	// 			return to / 2 * Math.pow(2, 10 * (elapsed - 1)) + from;

	// 		}
	// 		else {

	// 			return to / 2 * (-Math.pow(2, -10 * --elapsed) + 2) + from;

	// 		};

	// 	},
	// 	easeInCirc: function( x, elapsed, from, to, duration ){

	// 		return -to * (Math.sqrt(1 - (elapsed /= duration) * elapsed) - 1) + from;

	// 	},
	// 	easeOutCirc: function( x, elapsed, from, to, duration ){

	// 		return to * Math.sqrt(1 - (elapsed = elapsed / duration - 1) * elapsed) + from;

	// 	},
	// 	easeInOutCirc: function( x, elapsed, from, to, duration ){

	// 		if( (elapsed /= duration / 2) < 1){

	// 			return -to / 2 * (Math.sqrt(1 - elapsed * elapsed) - 1) + from;

	// 		}
	// 		else {

	// 			return to / 2 * (Math.sqrt(1 - (elapsed -= 2) * elapsed) + 1) + from;

	// 		};

	// 	},
	// 	easeInElastic: function( x, elapsed, from, to, duration ){

	// 		var s = 1.70158;
	// 		var p = 0;
	// 		var a = to;

	// 		if( elapsed == 0 ){

	// 			return from;

	// 		};

	// 		if( (elapsed /= duration) == 1 ){

	// 			return from + to;

	// 		};

	// 		if( !p ){

	// 			p = duration * 0.3;

	// 		};

	// 		if( a < Math.abs(to) ){

	// 			a = to;
	// 			var s = p / 4;

	// 		}
	// 		else {

	// 			var s = p / (2 * Math.PI) * Math.asin(to / a);

	// 		};

	// 		return -(a * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin( (elapsed * duration - s) * (2 * Math.PI) / p)) + from;

	// 	},
	// 	// x:x   t:elapsed   b:from   c:to    d:duration
	// 	easeOutElastic: function( x, elapsed, from, to, duration ){

	// 		var s = 1.70158;
	// 		var p = 0;
	// 		var a = to;

	// 		if( elapsed == 0 ) return from;

	// 		if( (elapsed /= duration) == 1 ) return from + to;

	// 		if( !p ) p = duration * 0.3;

	// 		if( a < Math.abs(to) ){

	// 			a = to;
	// 			var s = p / 4;

	// 		}
	// 		else var s = p / (2 * Math.PI) * Math.asin(to / a);

	// 		return a * Math.pow(2, -10 * elapsed) * Math.sin( (elapsed * duration - s) * (2 * Math.PI) / p ) + to + from;

	// 	},
	// 	easeInOutElastic: function( x, elapsed, from, to, duration ){

	// 		var s=1.70158;var p=0;var a=c;
	// 		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	// 		if (a < Math.abs(c)) { a=c; var s=p/4; }
	// 		else var s = p/(2*Math.PI) * Math.asin (c/a);
	// 		if (now < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	// 		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;

	// 	},
	// 	easeInBack: function (x, t, b, c, d, s) {

	// 		if (s == undefined) s = 1.70158;
	// 		return c*(t/=d)*t*((s+1)*t - s) + b;

	// 	},
	// 	easeOutBack: function (x, t, b, c, d, s) {
	// 		if (s == undefined) s = 1.70158;
	// 		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;

	// 	},
	// 	easeInOutBack: function (x, t, b, c, d, s) {
	// 		if (s == undefined) s = 1.70158; 
	// 		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	// 		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;

	// 	},
	// 	easeInBounce: function( x, now, from, to, duration ){

	// 		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;

	// 	},
	// 	easeOutBounce: function( x, now, from, to, duration ){

	// 		if ((t/=d) < (1/2.75)) {
	// 			return c*(7.5625*t*t) + b;
	// 		} else if (t < (2/2.75)) {
	// 			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	// 		} else if (t < (2.5/2.75)) {
	// 			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	// 		} else {
	// 			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	// 		}

	// 	},
	// 	easeInOutBounce: function( x, now, from, to, duration ){

	// 		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
	// 		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
		
	// 	}
	// };

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
				},
				constraints: {
					mandatory: {
						OfferToReceiveVideo: true,
						OfferToReceiveAudio: true
					}
				}
			}, settings);

			window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
			window.RTCPeerConnection = (window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.RTCPeerConnection);
			window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);

			this.peer = new RTCPeerConnection(settings.config);

			this.peer.addEventListener("icecandidate", function( event ){

				console.log("ICE CANDIDATE");

				if( !isEmpty(event.candidate) ){

					settings.socket.send("candidate", event.candidate);

				};

			}, false);

			this.peer.addStream(settings.stream);

			this.peer.addEventListener("addstream", function( event ){

				console.log("ADD STREAM");

				if( isFunction(settings.addStream) ){

					settings.addstream.call(this, window.URL.createObjectURL(event.stream), event.stream);

				};

			}.bind(this), false);

			this.peer.addEventListener("removestream", function( event ){

				console.log("REMOVE STREAM");

			}, false);

			this.peer.createOffer(function( description ){

				this.peer.setLocalDescription(description);
				settings.socket.send("description", description);

			}.bind(this), function(){

				console.log("CALL FAIL");

			}, settings.constraints);

			settings.socket.socket.addEventListener("message", function( message ){

				var data = JSON.parse(message.data);

				if( data.type === "offer" ){

					console.log("RECEIVE OFFER");

					this.peer.setRemoteDescription(new RTCSessionDescription(data.content));

					this.peer.createAnswer(function( description ){

						this.peer.setLocalDescription(description);
						settings.socket.send("description", description);

					}.bind(this), function(){

						console.log("ANSWER FAILED");

					}, settings.constraints);

				}
				else if( data.type === "answer" ){

					console.log("RECEIVE ANSWER");

					this.peer.setRemoteDescription(new RTCSessionDescription(data.content));

				}
				else if( data.type === "candidate" ){

					console.log("RECEIVE CANDIDATE");

					console.log(data.content);

					this.peer.addIceCandidate(new RTCIceCandidate(data.content));

				}
				else if( data.type === "close" ){

					console.log("RECEIVE BYE BYE");
					this.peer.close();

				};

			}.bind(this), false);

		}
	};

/*
	Jo.peer.fn = Jo.peer.prototype = {
		constructor: Jo.peer,
		init: function( settings ){

			settings = Jo.merge({
				config: {
					iceServers: new Array()
				},
				constraints: {
					mandatory: {
						OfferToReceiveAudio: true,
						OfferToReceiveVideo: true
					},
					optional: [
						{
							RtpDataChannels: true,							
						},
						{
							DtlsSrtpKeyAgreement: true
						}
					]
				}
			}, settings);

			window.RTCPeerConnection = (window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.RTCPeerConnection);
			window.RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
			window.RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);

			this.peer = new RTCPeerConnection(settings.config);

			this.peer.createDescription = function( description ){

				console.log("CREATE DESCRIPTION");

				this.peer.setLocalDescription(description);

				settings.socket.send(description.type, JSON.stringify(description));

			}.bind(this);

			this.constraints = settings.constraints;

			this.sources = new Array();

			this.events = new Object();

			this.peer.addEventListener("icecandidate", function( event ){
				
				console.log("ICE CANDIDATE");

				if( !isEmpty(event.candidate) ){

					console.log("SEND ICE CANDIDATE", event);

					settings.socket.send("candidate", JSON.stringify({
						sdpMLineIndex: event.candidate.sdpMLineIndex,
						sdpMid: event.candidate.sdpMid,
						candidate: event.candidate.candidate
					}));

				};

			}, false);

			this.peer.addEventListener("addstream", function( event ){

				console.log("ADD STREAM", event);

				var url = this.sources.push(decodeURIComponent(window.URL.createObjectURL(event.stream))) - 1;

				if( !isEmpty(this.events.stream) ){

					for( var fn in this.events.stream ){

						this.events.stream[fn].call(this, this.sources[url], event.stream);

					};

				};

			}.bind(this), false);

			this.peer.addEventListener("removestream", function( event ){

				console.log("REMOVE STREAM");

			}, false);

			settings.socket.socket.addEventListener("message", function( message ){

				var data = JSON.parse(message.data);

				console.log("SERVER RESPOND AN => ", data.type);

				if( data.content.type === "offer" ){

					console.log("ANSWER OFFER");

					this.peer.setRemoteDescription(new RTCSessionDescription(data.content));
					this.peer.createAnswer(this.peer.createDescription, function( event ){

						console.log("CONNECTION FAIL", event);

						if( isFunction(settings.error) ){

							settings.error();

						};

					}, this.constraints)

				}
				else if( data.content.type === "answer" ){

					console.log("ANSWER !")

					this.peer.setRemoteDescription(new RTCSessionDescription(data.content));
					this.peer.setRemoteDescription(new RTCSessionDescription(data.content));

				}
				else if( data.content.type === "candidate" ){

					console.log("CANDIDATING");

					this.peer.addIceCandidate(new RTCIceCandidate(data.content));

				};

			}.bind(this), false);

			return this;

		},
		addStream: function( stream ){

			console.log("ADD STREAM");
			this.peer.addStream(stream);

			return this;

		},
		call: function(){

			this.peer.createOffer(this.peer.createDescription, function(){

				console.log("FAIL TO SEND OFFER");

			}.bind(this), this.constraints);

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
		answer: function(){

		},
		remove: function(){

		}
	};
*/
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
