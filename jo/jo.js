/**
* @package Jo (JavaScript overloaded)
* @author Jordan Delcros <www.jordan-delcros.com>
*/
(function( window, undefined ){
	"use strict";

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

						var display = window.getComputedStyle(this, null).getPropertyValue("display");

						this.style.display = "none";

						returned.push(window.getComputedStyle(this, null).getPropertyValue(property));

						this.style.display = display;

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

			Jo(this).node().remove();

			if( isString(html) || isNumber(html) ){

				if( isNumber(html) ){

					html = html.toString();

				};

				var temporaryNode = document.createElement("div");
				temporaryNode.innerHTML = html;


				html = temporaryNode.childNodes;

				temporaryNode.remove();
				console.log(html);

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

					Jo(this).insertEnd(html[node].cloneNode(true));

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

						var propertyUncamelize = camelize(property);

						$this.animation.properties[property] = {
							from: {
								origin: $this.css(propertyUncamelize)[0],
								values: new Array()
							},
							to: {
								origin: styles[property].toString(),
								values: new Array(),
								differences: new Array()
							}
						};

						if( $this.animation.properties[property].from.origin === "auto" ){

							$this.animation.properties[property].from.origin = window.getComputedStyle(this, null).getPropertyValue(property);

						};

						$this.animation.properties[property].model = $this.animation.properties[property].to.origin
							.replace(regexp.containLength, function( match, number, type ){

								var number = parseFloat(number);

								if( type === "em" ){

									number = number * parseFloat($this.parent().css("font-size")[0]);
									type = "px";

								}
								else if( type === "rem" ){

									number = number * parseFloat(Jo("html").css("font-size"));
									type = "px";

								}
								else if( type === "pt" ){

									number = number * 96 / 72;
									type = "px";

								};

								var index = $this.animation.properties[property].to.values.push({
									number: number,
									type: type
								});


								return "#" + (index - 1);

							})
							.replace(regexp.containHexColor, function( match, red, green, blue ){

								if( red.length === 1 ){

									red = red + red;

								};

								if( green.length === 1 ){

									green = green + green;

								};

								if( blue.length === 1 ){

									blue = blue + blue;

								};

								return "rgba(" + parseInt(red, 16) + ", " + parseInt(green, 16) + ", " + parseInt(blue, 16) + ", 1)";

							})
							.replace(regexp.containRGBColor, function( match, red, green, blue, alpha ){

								if( isEmpty(alpha) ){

									alpha = 1;

								};

								var redIndex = $this.animation.properties[property].to.values.push({
									number: parseInt(red),
									precision: "integer"
								});

								var greenIndex = $this.animation.properties[property].to.values.push({
									number: parseInt(green),
									precision: "integer"
								});

								var blueIndex = $this.animation.properties[property].to.values.push({
									number: parseInt(blue),
									precision: "integer"
								});

								var alphaIndex = $this.animation.properties[property].to.values.push({
									number: parseFloat(alpha)
								});

								return "rgba(#" + (redIndex - 1) + ", #" + (greenIndex - 1) + ", #" + (blueIndex - 1) + ", #" + (alphaIndex - 1) + ")";

							});

						$this.animation.properties[property].from.origin
							.replace(regexp.containLength, function( match, number, type ){

								var index = $this.animation.properties[property].from.values.push(new Object());

								number = parseFloat(match);

								if( type !== $this.animation.properties[property].to.values[index - 1].type ){

									var toNumber = $this.animation.properties[property].to.values[index - 1].number;
									var toType = $this.animation.properties[property].to.values[index - 1].type;

									if( toType === "px" ){

										number = parseFloat(window.getComputedStyle(this, null).getPropertyValue(property));
										type = "px";

									}
									else if( toType === "%" ){

										number = number / parseFloat(window.outerWidth) * 100;
										type = "%";

									};

								};

								$this.animation.properties[property].from.values[index - 1].number = number;
								$this.animation.properties[property].from.values[index - 1].type = type;

								return false;

							}.bind(this))
							.replace(regexp.containRGBColor, function( match, red, green, blue, alpha ){

								if( isEmpty(alpha) ){

									alpha = 1;

								};

								var redIndex = $this.animation.properties[property].from.values.push({
									number: parseInt(red),
									precision: "integer"
								});

								var greenIndex = $this.animation.properties[property].from.values.push({
									number: parseInt(green),
									precision: "integer"
								});

								var blueIndex = $this.animation.properties[property].from.values.push({
									number: parseInt(blue),
									precision: "integer"
								});

								var alphaIndex = $this.animation.properties[property].from.values.push({
									number: parseFloat(alpha)
								});

								return false;

							});

						for( var value = 0; value < $this.animation.properties[property].to.values.length; value++ ){


							var difference = Math.abs($this.animation.properties[property].from.values[value].number - $this.animation.properties[property].to.values[value].number);

							if( $this.animation.properties[property].from.values[value].number > $this.animation.properties[property].to.values[value].number ){

								difference = -difference;

							};

							$this.animation.properties[property].to.differences.push(difference);

						};

					};

				};

				$this.animation.fn = function( now ){

					if( isEmpty($this.animation.times.start) ){

						$this.animation.times.start = now;

					};

					$this.animation.times.elapsed = now - $this.animation.times.start;

					if( $this.animation.times.elapsed > options.duration ){

						$this.animation.times.elapsed = options.duration;

					};

					for( var property in $this.animation.properties ){

						if( $this.animation.properties.hasOwnProperty(property) ){

							if( $this.animation.times.elapsed < options.duration ){

								$this.animation.properties[property].progress = $this.animation.properties[property].model;

								for( var value = 0; value < $this.animation.properties[property].to.values.length; value++ ){

									var valueString = $this.animation.properties[property].from.values[value].number + (Jo.easing[options.easing]($this.animation.times.elapsed, options.duration) * $this.animation.properties[property].to.differences[value]);

									if( $this.animation.properties[property].from.values[value].precision === "integer" ){

										valueString = parseInt(valueString);

									};

									if( !isEmpty($this.animation.properties[property].to.values[value].type) ){

										valueString += $this.animation.properties[property].to.values[value].type;

									};

									$this.animation.properties[property].progress = /**/ $this.animation.properties[property].progress.replace("#" + value, valueString);

								};

								this.style[property] = $this.animation.properties[property].progress;

							}
							else {

								this.style[property] = $this.animation.properties[property].to.origin;

							};

						};

					};

					if( $this.animation.times.elapsed === options.duration ){

						cancelAnimationFrame($this.animation.id);

						if( isFunction(options.complete) ){

							options.complete.call(this);

						};

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
		linear: function( elapsed, duration ){

			if( elapsed === duration ){

				return 1;

			}
			else {

				return (elapsed / duration) % 1;

			};

		},
		easeInQuad: function( elapsed, duration ){

			return (elapsed /= duration) * elapsed;

		},
		easeOutQuad: function( elapsed, duration ){

			return -(elapsed /= duration) * (elapsed - 2);

		},
		easeInOutQuad: function( elapsed, duration ){

			if( (elapsed /= duration / 2) < 1 ){

				return 0.5 * elapsed * elapsed;

			}
			else {

				return -0.5 * ((--elapsed) * (elapsed - 2) - 1);

			};

		},
		easeInCubic: function( elapsed, duration ){

			return (elapsed /= duration) * elapsed * elapsed;

		},
		easeOutCubic: function( elapsed, duration ){

			return ((elapsed = elapsed / duration - 1) * elapsed * elapsed + 1);

		},
		easeInOutCubic: function( elapsed, duration ){

			if( (elapsed /= duration / 2) < 1 ){

				return 0.5 * elapsed * elapsed * elapsed;

			}
			else {

				return 0.5 * ((elapsed -= 2) * elapsed * elapsed + 2);

			};

		},
		easeInQuart: function( elapsed, duration ){

			return (elapsed /= duration) * elapsed * elapsed * elapsed;

		},
		easeOutQuart: function( elapsed, duration ){

			return -((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed - 1);

		},
		easeInOutQuart: function( elapsed, duration ){

			if( (elapsed /= duration / 2) < 1 ){

				return 0.5 * elapsed * elapsed * elapsed * elapsed;

			}
			else {

				return -0.5 * ((elapsed -= 2) * elapsed * elapsed * elapsed - 2);

			};

		},
		easeInQuint: function( elapsed, duration ){

			return (elapsed /= duration) * elapsed * elapsed * elapsed * elapsed;

		},
		easeOutQuint: function( elapsed, duration ){

			return ((elapsed = elapsed / duration - 1) * elapsed * elapsed * elapsed * elapsed + 1);
	
		},
		easeInOutQuint: function( elapsed, duration ){

			if( (elapsed /= duration / 2) < 1 ){

				return 0.5 * elapsed * elapsed * elapsed * elapsed * elapsed;
			
			}
			else {

				return 0.5 * ((elapsed -= 2) * elapsed * elapsed * elapsed * elapsed + 2);

			};

		},
		easeInSine: function( elapsed, duration ){

			return -Math.cos(elapsed / duration * (Math.PI / 2)) + 1;

		},
		easeOutSine: function( elapsed, duration ){

			return Math.sin(elapsed / duration * (Math.PI / 2));

		},
		easeInOutSine: function( elapsed, duration ){

			return -0.5 * (Math.cos(Math.PI * elapsed / duration) - 1);

		},
		easeInExpo: function( elapsed, duration ){

			if( elapsed === 0 ){

				return 0;

			}
			else {

				return Math.pow(2, 10 * (elapsed / duration - 1));

			};

		},
		easeOutExpo: function( elapsed, duration ){

			if( elapsed === duration ){

				return 1;

			}
			else {

				return -Math.pow(2, -10 * elapsed / duration) + 1;

			};

		},
		easeInOutExpo: function( elapsed, duration ){

			if( elapsed === 0 ){

				return 0;

			}
			else if( elapsed === duration ){

				return 1;

			}
			else if( (elapsed /= duration / 2) < 1 ){

				return 0.5 * Math.pow(2, 10 * (elapsed - 1));

			}
			else {

				return 0.5 * (-Math.pow(2, -10 * --elapsed) + 2);

			};

		},
		easeInCirc: function( elapsed, duration ){

			return -(Math.sqrt(1 - (elapsed /= duration) * elapsed) - 1);

		},
		easeOutCirc: function( elapsed, duration ){

			return Math.sqrt(1 - (elapsed = elapsed / duration - 1) * elapsed);

		},
		easeInOutCirc: function( elapsed, duration ){

			if( (elapsed /= duration / 2) < 1){

				return -0.5 * (Math.sqrt(1 - elapsed * elapsed) - 1);

			}
			else {

				return 0.5 * (Math.sqrt(1 - (elapsed -= 2) * elapsed) + 1);

			};

		},
		easeInElastic: function( elapsed, duration ){

			var speed = (1 + Math.sqrt(5)) / 2;
			var progress = 0;

			if( elapsed === 0 ){

				return 0;

			}
			else if( (elapsed /= duration) === 1 ){

				return 1;

			}
			else {

				if( progress === 0 ){

					progress = duration * 0.3;

				};

				speed = progress / (2 * Math.PI) * Math.asin(1);

				return -(1 * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin((elapsed * duration - speed) * (2 * Math.PI) / progress));

			};

		},
		easeOutElastic: function( elapsed, duration ){

			var speed = (1 + Math.sqrt(5)) / 2;
			var progress = 0;

			if( elapsed === 0 ){

				return 0;

			}
			else if( (elapsed /= duration) == 1 ){

				return 1;

			}
			else {

				if( progress === 0 ){

					progress = duration * 0.3;

				};

				speed = progress / (2 * Math.PI) * Math.asin(1);

				return Math.pow(2, -10 * elapsed) * Math.sin((elapsed * duration - speed) * (2 * Math.PI) / progress) + 1;

			};


		},
		easeInOutElastic: function( elapsed, duration ){

			var speed = (1 + Math.sqrt(5)) / 2;
			var progress = 0;

			if( elapsed === 0){

				return 0;

			}
			else if( (elapsed /= duration / 2) === 2 ){

				return 1;

			}
			else {

				if( progress === 0 ){

					progress = duration * (0.3 * 1.5);

				};

				speed = progress / (2 * Math.PI) * Math.asin(1);

				if( elapsed < 1 ){

					return -0.5 * (1 * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin((elapsed * duration - speed) * (2 * Math.PI) / progress ));

				}
				else {

					return Math.pow(2, -10 * (elapsed -= 1)) * Math.sin((elapsed * duration - speed) * (2 * Math.PI) / progress ) * 0.5 + 1;

				};

			};

		},
		easeInBack: function( elapsed, duration ){

			var speed = (1 + Math.sqrt(5)) / 2;

			return (elapsed /= duration) * elapsed * ((speed + 1) * elapsed - speed);

		},
		easeOutBack: function( elapsed, duration, s ){

			var speed = (1 + Math.sqrt(5)) / 2;

			return ((elapsed = elapsed / duration - 1) * elapsed * ((speed + 1) * elapsed + speed) + 1);

		},
		easeInOutBack: function( elapsed, duration, s ){

			var speed = (1 + Math.sqrt(5)) / 2;

			if( (elapsed /= duration / 2) < 1 ){

				return 0.5 * (elapsed * elapsed * (((speed *= (1.525)) + 1) * elapsed - speed));

			}
			else {

				return 0.5 * ((elapsed -= 2) * elapsed * (((speed *= (1.525)) + 1) * elapsed + speed) + 2);

			};

		},
		easeInBounce: function( elapsed, duration ){

			return 1 - Jo.easing.easeOutBounce(duration - elapsed, duration);

		},
		easeOutBounce: function( elapsed, duration ){

			if( (elapsed /= duration) < (1 / 2.75) ){

				return 1 * (7.5625 * elapsed * elapsed);

			}
			else if( elapsed < (2 / 2.75) ){

				return 1 * (7.5625 * (elapsed -= (1.5 / 2.75)) * elapsed + 0.75);

			}
			else if( elapsed < (2.5 / 2.75) ){

				return 1 * (7.5625 * (elapsed -= (2.25 / 2.75)) * elapsed + 0.9375);
			}
			else {

				return 1 * (7.5625 * (elapsed -= (2.625 / 2.75)) * elapsed + 0.984375);

			};

		},
		easeInOutBounce: function( elapsed, duration ){

			if( elapsed < duration / 2 ){
				
				return Jo.easing.easeInBounce(elapsed * 2, duration) * 0.5;

			}
			else {

				return Jo.easing.easeOutBounce(elapsed * 2 - duration, duration) * 0.5 + 1 * 0.5;
				
			}
		
		}
	};

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

		return source instanceof Object && typeof source === "object";

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

	function camelize( text ){

		return text.replace(new RegExp("([a-z])([A-Z])", "g"), "$1-$2").toLowerCase();

	};

	var regexp = {
		containLength: new RegExp("(\\d*\\.?\\d+)(em|ex|grad|ch|deg|ms|rad|rem|s|turn|vh|vw|vmin|vmax|px|cm|in|pt|pc|%)?", "gi"),
		containRGBColor: new RegExp("rgba?\\(([0-9]{1,3})[,\\s]{1,}([0-9]{1,3})[,\\s]{1,}([0-9]{1,3})[,\\s]{0,}([0-1]{1}\\.?[0-9]*)?\\)", "gi"),
		containHexColor: new RegExp("^#([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$", "gi")
	};

	var prefix = function(){

		var styles = getComputedStyle(document.documentElement, null);

		var match = Array.prototype.slice.call(styles).join("").match(new RegExp("-(webkit|moz|ms)-", "gi"))[0];

		return {
			dom: ("Webkit|Moz|MS|O").match(new RegExp("")),
			css: "-" + match + "-",
			js: match[0].toUpperCase() + match.substr(1)
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

	Jo.merge = function( returned ){

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
