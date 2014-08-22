/**
* @package Jo (JavaScript overloaded)
* @author Jordan Delcros <www.jordan-delcros.com>
* @github <www.github.com/JordanDelcros/Jo>
*/
(function( window, undefined ){
	"use strict";

	var documentRoot = document;
	var temporaryNode = documentRoot.createElement("div");

	var Jo = function( selector, context, documentRoot ){

		return new Jo.fn.init(selector, context, documentRoot);

	};

	Jo.fn = Jo.prototype = {
		Jo: "0.1",
		constructor: Jo,
		init: function( selector, context ){

			var found = new Array();

			if( !isEmpty(selector) ){

				if( isFunction(selector) ){

					var previousOnload = window.onload;

					window.onload = function(){
						
						if( isFunction(previousOnload) ) previousOnload();

						selector.call(this, Jo);

					};
					
				}
				else if( isString(selector) ){

					if( selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" ){

						var singleTag = regularExpressions.singleTag.exec(selector);

						if( !isEmpty(singleTag) && singleTag.length > 0 ){

							found.push(document.createElement(singleTag[1]));

						}
						else {

							var temporary = temporaryNode.cloneNode(false);

							temporary.innerHTML = selector;

							found = temporary.childNodes;

							temporary.remove();

						};

					}
					else {

						found = getNodes(selector);

					};
				
				}
				else if( isNodeList(selector) ){

					for( var node = 0, length = selector.length; node < length; node++ ){

						found.push(selector[node]);

					};

				}
				else if( isNode(selector) ){

					found.push(selector);

				}
				else if( isWindow(selector) ){

					found.push(window);

				}
				else if( isJo(selector) ){

					found = selector.found;

				};

			};

			this.selector = selector;
			this.found = found;
			this.length = found.length;

			return this;

		},
		find: function( selector ){

			var $this = Jo(this);

			var found = new Array();


			$this.each(function(){

				found = found.concat(getNodes(selector, this));

			});

			$this.found = found;
			$this.length = $this.found.length;
			$this.selector = selector;

			return $this;

		},
		siblings: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			this.each(function(){

				Array.prototype.filter.call(this.parentNode.children, function( child ){

					var $child = Jo(child);

					if( !$child.is(this) ){

						if( !isEmpty(selector) ){

							if( $child.is(selector) ){

								found.push(child);

							};

						}
						else {

							found.push(child);

						};

					};

				}.bind(this));

			});

			$this.found = found;
			$this.length = found.length;

			return $this;

		},
		siblingsBefore: function(){

			var $this = Jo(this);

			var found = new Array();

			this.each(function(){

				var $target = Jo(this);

				Array.prototype.filter.call(this.parentNode.children, function( child ){

					var $child = Jo(child);

					if( !$child.is($target) && $child.index() < $target.index() ){

						if( !isEmpty(selector) && $child.is(selector) ){

							found.push(child);

						}
						else {

							found.push(child);

						};

					};

				});

			});

			$this.found = found;
			$this.length = found.length;

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

			$this.each(function(){

				var nodes = this.childNodes;

				for( var node = 0, length = nodes.length; node < length; node++ ){

					if( (!isEmpty(selector) && isString(selector) && !Jo(nodes[node]).is(selector)) || (isTrue(normalize) && isText(nodes[node]) && regularExpressions.onlySpaces.test(nodes[node].textContent)) ){

						continue;

					}
					else {

						found.push(nodes[node]);

					};

				};

			});

			$this.found = found;
			$this.length = $this.found.length;

			return $this;

		},
		child: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var childs = this.children;

				for( var child = 0, length = childs.length; child < length; child++ ){

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
		parent: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			console.log("PARENT")

			$this.each(function(){

				if( !isEmpty(selector) ){

					var element = this.parentNode;

					if( !isEmpty(element) ){

						if( Jo(element).is(selector) ){

							found.push(element);

						};

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
		parents: function( selector, otherwise ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var element = this;

				if( !isEmpty(selector) ){

					if( isTrue(otherwise) ){

						while( element.parentNode ){

							element = element.parentNode;

							if( !isEmpty(element) ){

								if( !Jo(element).is(selector) ){

									found.push(element);

								}
								else {

									break;

								};

							};

						};

					}
					else {

						while( element.parentNode ){

							element = element.parentNode;

							if( !isEmpty(element) ){

								if( Jo(element).is(selector) ){

									found.push(element);

									break;

								};

							};

						};

					};

				}
				else {

					while( element.parentNode ){

						element = element.parentNode;

						if( !isEmpty(element) ){

							found.push(element);

						};

					};

				};

			});

			$this.found = found;
			$this.length = $this.found.length;

			return $this;

		},
		item: function( number ){

			if( number <= this.found.length ){

				if( number < 0 ){

					number = this.found.length - number;

				};

				return Jo(this.found[number]);

			}
			else {

				return Jo();

			};

		},
		previous: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var target = this;

				while( !isEmpty(target.previousElementSibling) ){

					target = target.previousElementSibling;

					if( (!isEmpty(selector) && isString(selector) && Jo(target).is(selector)) || isEmpty(selector) ){

						found.push(target);
						break;

					};

				};

			});

			$this.found = found;
			$this.length = $this.found.length;

			return $this;

		},
		previousNode: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var target = this;

				while( !isEmpty(target.previousElementSibling) ){

					target = target.previousSibling;

					if( (!isEmpty(selector) && isString(selector) && Jo(target).is(selector)) || isEmpty(selector) ){

						found.push(target);
						break;

					};

				};

			});

			$this.found = found;
			$this.length = $this.found.length;

			return $this;

		},
		next: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var target = this;

				while( !isEmpty(target.nextElementSibling) ){

					target = target.nextElementSibling;

					if( (!isEmpty(selector) && isString(selector) && Jo(target).is(selector)) || isEmpty(selector) ){

						found.push(target);
						break;

					};

				};

			});

			$this.found = found;
			$this.length = $this.found.length;

			return $this;

		},
		nextNode: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var target = this;

				while( !isEmpty(target.nextElementSibling) ){

					target = target.nextSibling;

					if( (!isEmpty(selector) && isString(selector) && Jo(target).is(selector)) || isEmpty(selector) ){

						found.push(target);
						break;

					};

				};

			});

			$this.found = found;
			$this.length = $this.found.length;

			return $this;

		},
		each: function( fn ){

			for( var index = 0, length = this.found.length; index < length; index++ ){

				fn.call(this.found[index], index);

			};
			
			return this;

		},
		filter: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			if( isString(selector) ){

				$this.each(function(){

					if( Jo(this).is(selector) ){

						found.push(this);

					};

				});

			}
			else if( isFunction(selector) ){

				$this.each(function(){

					if( selector.call(this) === true ){

						found.push(this);

					};

				});

			};

			$this.found = found;
			$this.length = $this.found.length;

			return $this;

		},
		is: function( selector ){

			var returned = isEmpty(selector) ? false : true;

			if( isJo(selector) ){

				this.each(function( index ){

					if( this !== selector.found[index] ){

						returned = false;

					};

				});

			}
			else if( isNode(selector) ){

				this.each(function(){

					if( this !== selector ){

						returned = false;

					};

				});

			}
			else if( isNodeList(selector) ){

				this.each(function( index ){

					if( this !== selector[index] ){

						returned = false;

					};

				});

			}
			else if( isString(selector) ){

				selector = prepareSelector(selector);

				this.each(function(){

					this.matches = (this.matches || this.matchesSelector || this.msMatchesSelector || this.mozMatchesSelector || this.webkitMatchesSelector || this.oMatchesSelector || function(){ return false });

					if( isFalse(this.matches(selector)) ){

						returned = false;

					};

				});
				
			};

			return returned;

		},
		on: function( actions, fn, useCapture ){

			actions = actions.split(" ");

			if( isEmpty(useCapture) ){

				useCapture = false;

			};

			var originalActions = Jo.merge(new Array(), actions);

			this.each(function(){

				if( !isObject(this.events) ){

					this.events = new Object();

				};

				for( var action in actions ){

					if( !isArray(this.events[originalActions[action][action]]) ){

						this.events[originalActions[action]] = new Array();

					};

					var evt = {
						action: actions[action],
						fn: fn
					};

					if( !isFunction(Jo.specialEvents[actions[action]]) && !Jo.support.events(this, actions[action]) ){

						var customEvent = new CustomEvent(actions[action], {
							detail: {},
							bubbles: true,
							cancelable: true
						});

						evt.action = customEvent;

						var f = this.events[originalActions[action]].push(evt) - 1;

						this.addEventListener(actions[action], this.events[originalActions[action]][f].fn, useCapture);

					}
					else if( isFunction(Jo.specialEvents[actions[action]]) && !Jo.support.events(this, actions[action]) ){

						var specialEvent = Jo.specialEvents[actions[action]].call(this, fn);

						evt.action = specialEvent.action;

						actions[action] = specialEvent.action;
						fn = specialEvent.fn;

						var f = this.events[originalActions[action]].push(evt) - 1;

						this.addEventListener(actions[action], this.events[originalActions[action]][f].fn, useCapture);

					}
					else {

						var f = this.events[originalActions[action]].push(evt) - 1;

						this.addEventListener(actions[action], this.events[originalActions[action]][f].fn, useCapture);

					};

				};


			});

			return this;

		},
		off: function( actions, fn, useCapture ){

			actions = actions.split(" ");

			if( isBoolean(fn) ){

				useCapture = fn;
				fn = undefined;

			};

			if( isEmpty(useCapture) ){

				useCapture = false;

			};

			return this.each(function(){

				for( var action in actions ){

					if( !isEmpty(this.events[actions[action]]) ){

						for( var i in this.events[actions[action]] ){

							if( isFunction(fn) && this.events[actions[action]][i].fn === fn ){

								this.removeEventListener(this.events[actions[action]][i].action, this.events[actions[action]][i].fn, useCapture);
								this.events[actions[action]].splice(i, 1);

							}
							else if( isEmpty(fn) ){

								this.removeEventListener(this.events[actions[action]][i].action, this.events[actions[action]][i].fn, useCapture);
								this.events[actions[action]].splice(i, 1);

							};

						};

					};

				};


			});

		},
		trigger: function( actions ){

			actions = actions.split(" ");

			return this.each(function( event ){

				for( var action in actions ){

					if( !isEmpty(this.events) && !isEmpty(this.events[actions[action]]) ){

						if( !isFunction(Jo.specialEvents[actions[action]]) && !Jo.support.events(this, actions[action]) ){

							this.dispatchEvent(this.events[actions[action]].action);

						}
						else {

							for( var i in this.events[actions[action]] ){

								this.events[actions[action]][i].fn.call(this, event);

							};

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

					i = i.replace(/^data(?!-)/, "data-");

					this.each(function(){

						this.setAttribute(i, name[i]);

					});

				};

			};

			return this;

		},
		width: function( width ){

			if( isEmpty(width) ){

				var returned = new Array();

				this.each(function(){

					returned.push(this.outerWidth || this.clientWidth);

				});

				return returned;

			}
			else {

				this.css("width", width);

			};

		},
		height: function( height ){


			if( isEmpty(height) ){

				var returned = new Array();

				this.each(function(){

					returned.push(this.outerHeight || this.clientHeight);

				});

				return returned;

			}
			else {

				this.css("height", height);

			};

		},
		css: function( property, value, unverify ){

			if( isString(property) ){

				if( !isEmpty(value) ){

					value = value.toString();

					this.each(function(){

						if( isTrue(unverify) ){
 
							property = prepareCSSProperty(property);

						};

						this.style[property] = value;

					});

				}
				else {

					var returned = new Array();

					this.each(function(){

						var computedStyles = window.getComputedStyle(this, null);

						if( !isEmpty(computedStyles) ){

							if( isTrue(value) ){

								property = prepareCSSProperty(property);

							};


							var display = computedStyles.getPropertyValue("display");

							var removeDisplay = false;

							if( isEmpty(this.style.display) ){

								removeDisplay = true;

							};

							this.style.display = "none";

							var found = computedStyles.getPropertyValue(property);

							this.style.display = isTrue(removeDisplay) ? "" : display;

							if( found === "auto" || found === "none" ){

								found = computedStyles.getPropertyValue(property);

							};

							if( isEmpty(found, true) ){

								found = this.style[property];

							};

							returned.push(found);

						};

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

						returned[property[i]].push(Jo(this).css(property));

					};

				});

				return returned;

			}
			else if( isObject(property) ){

				this.each(function(){

					for( var parameter in property ){

						if( property.hasOwnProperty(parameter) ){

							if( isTrue(value) ){

								parameter = prepareCSSProperty(parameter);

							};

							this.style[parameter] = property[parameter];

						};

					};

				});

			}
			else if( isEmpty(property) ){

				var returned = new Array();

				this.each(function(){

					returned.push(window.getComputedStyle(this, null));

				});

				return returned;

			};

			return this;

		},
		transform: function( transformation ){

			if( isEmpty(transformation) ){

				this.each(function(){

					var value = Jo(this).css("transform");

					console.log("ORIGIN", value);

					var transform = value[0].split(/\s*[(),]\s*/).slice(1, -1);
					var matrix;

					if( transform.length === 6 ){

						matrix = {
							m11: parseFloat(transform[0]),
							m21: parseFloat(transform[2]),
							m31: 0,
							m41: parseFloat(transform[4]),
							m12: parseFloat(transform[1]),
							m22: parseFloat(transform[3]),
							m32: 0,
							m42: parseFloat(transform[5]),
							m13: 0,
							m23: 0,
							m33: 1,
							m43: 0,
							m14: 0,
							m24: 0,
							m34: 0,
							m44: 1
						};

					}
					else if( transform.length === 16 ){

						matrix = {
							m11: parseFloat(transform[0]),
							m21: parseFloat(transform[4]),
							m31: parseFloat(transform[8]),
							m41: parseFloat(transform[12]),
							m12: parseFloat(transform[1]),
							m22: parseFloat(transform[5]),
							m32: parseFloat(transform[9]),
							m42: parseFloat(transform[13]),
							m13: parseFloat(transform[2]),
							m23: parseFloat(transform[6]),
							m33: parseFloat(transform[10]),
							m43: parseFloat(transform[14]),
							m14: parseFloat(transform[3]),
							m24: parseFloat(transform[7]),
							m34: parseFloat(transform[11]),
							m44: parseFloat(transform[15])
						};

					}
					else {

						matrix = {
							m11: 1,
							m21: 0,
							m31: 0,
							m41: 0,
							m12: 0,
							m22: 1,
							m32: 0,
							m42: 0,
							m13: 0,
							m23: 0,
							m33: 1,
							m43: 0,
							m14: 0,
							m24: 0,
							m34: 0,
							m44: 1
						};

					};

					var scaleX = Math.sqrt(matrix.m11 * matrix.m11 + matrix.m12 * matrix.m12);
					var scaleY = Math.sqrt(matrix.m21 * matrix.m21 + matrix.m22 * matrix.m22);

					var translateX = matrix.m41;
					var translateY = matrix.m42;
					var translateZ = matrix.m43;
				
					var rotateX = Math.atan2(matrix.m23, matrix.m33);
					var rotateY = Math.asin(-matrix.m13);
					var rotateZ = Math.atan2(matrix.m12, matrix.m11);

					if( Math.cos(rotateY) === 0 ){

						rotateX = Math.atan2(-matrix.m31, matrix.m22);
						rotateZ = 0;

					};

					console.log({
						scaleX: scaleX,
						scaleY: scaleY,
						translateX: translateX,
						translateY: translateY,
						translateZ: translateZ,
						rotateX: rotateX * 180 / Math.PI,
						rotateY: rotateY * 180 / Math.PI,
						rotateZ: rotateZ * 180 / Math.PI
					});

				});

			}
			else {



			};

			return this;

		},
		scroll: function( x, y ){

			if( !isEmpty(x) ){

				this.each(function(){

					this.scrollLeft = x;

					if( !isEmpty() ){

						this.scrollTop = y;

					};

				});

				return this;

			}
			else {

				var returned = new Array();

				this.each(function(){

					returned.push({
						left: this.scrollLeft,
						top: this.scrollTop
					});

				});

				return returned;

			};

		},
		offset: function(){

			var returned = new Array();

			this.each(function(){

				returned.push({
					left: this.offsetLeft,
					top: this.offsetTop
				});

			});

			return returned;

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
		hasClass: function( className ){

			var returned = new Array();

			this.each(function(){

				returned.push(this.classList.contains(className));

			});

			return returned;

		},
		toggleClass: function( className ){

			this.each(function(){

				this.classList.toggle(className);

			});

			return this;

		},
		html: function( html ){

			var $this = Jo(this);

			if( isEmpty(html) ){

				var returned = new Array();

				$this.each(function(){

					returned.push(this.innerHTML);

				});

				return returned;

			}
			else if( isString(html) ){

				$this.each(function(){

					this.innerHTML = html;
					
				});

			}
			else {

				$this.html("").insertEnd(html);

			};

			$this.found = this.found; //updateNodes($this);
			$this.length = $this.found.length;

			return $this;

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

					if( Jo(this).is("text") ){

						this.nodeValue = text;

					}
					else {

						this.innerText = text;

					};

				});

				this.found = this.found;//updateNodes(this);
				this.length = this.found.length;

				return this;

			};

		},
		value: function( text ){

			if( isEmpty(text) ){

				var returned = new Array();

				this.each(function(){

					returned.push(this.value);

				});

				return returned;

			}
			else {

				this.each(function(){

					this.value = text;

				});

				this.found = updateNodes(this);
				this.length = this.found.length;

				return this;

			};

		},
		data: function( name, value ){

			if( isEmpty(name) ){

				var returned = new Array();

				this.each(function(){

					returned.push(this.data);

				});

				return returned;

			}
			else if( isEmpty(value) && !isString(value) ){

				var returned = new Array();

				this.each(function(){

					if( !isEmpty(this.data) ){

						returned.push(this.data[name]);

					}
					else {

						returned.push(undefined);

					};

				});

				return returned;

			}
			else {

				this.each(function(){

					if( isEmpty(this.data) ){

						this.data = new Object();

					};

					this.data[name] = value;

				});

			};

			return this;

		},
		toString: function(){

			var returned = "";

			this.each(function(){

				if( isText(this) ){

					returned += this.textContent;

				}
				else {

					returned += this.outerHTML;

				};

			});

			return returned;

		},
		index: function(){

			var returned = new Array();

			this.each(function(){

				returned.push(Array.prototype.indexOf.call(this.parentNode.childNodes, this));

			});

			return returned;

		},
		indexType: function(){

			var returned = new Array();

			this.each(function(){

				var element = this;

				var index = 0;

				while( element.previousElementSibling ){

					if( element.nodeName.toLowerCase() === this.nodeName.toLowerCase() ){

						index++;

					};

					element = element.previousElementSibling;

				};

				returned.push(index);

			});

			return returned;

		},
		focus: function( positionStart, positionEnd ){

			this.each(function(){

				this.focus();

				if( isNumber(positionStart) ){

					if( this.setSelectionRange ){

						if( !isNumber(positionEnd) ){

							positionEnd = positionStart;

						};

						this.setSelectionRange(positionStart, positionEnd);
						
					}
					else {

						if( !isNumber(positionEnd) ){

							positionEnd = 0;

						};

						var selection = document.getSelection();
						var range = document.createRange();

						range.setStart(this, 0);
						range.setEnd(this, 0);

						selection.removeAllRanges();
						selection.addRange(range);

						for( var position = 0; position < positionStart; position++ ){

							selection.modify("move", "forward", "character");

						};

						for( var position = 0; position < positionEnd; position++ ){

							selection.modify("extend", "forward", "character");

						};

					};
					
				};

			});

			return this;

		},
		cursor: function( x, y ){

			var returned = new Array();

			this.each(function(){

				var cursor = new Object();
				var range;

				if( this.setSelectionRange ){

					if( "value" in this ){

						if( isEmpty(this.firstChild) ){

							this.appendChild(document.createTextNode(""));

						};

						this.firstChild.nodeValue = this.value;

						range = document.createRange();

						var selectionStart = this.selectionStart;
						var selectionEnd = this.selectionEnd;

						if( selectionStart > this.value.length ){

							selectionStart = this.value.length;

						};

						if( selectionEnd > this.value.length ){

							selectionEnd = this.value.length;

						};

						range.setStart(this.firstChild, selectionStart);
						range.setEnd(this.firstChild, selectionEnd);

					}
					else {

						range = document.getSelection().getRangeAt(0);

					};

				}
				else if( !isEmpty(x) && !isEmpty(y) ){

					range = document.caretRangeFromPoint(x, y);

				}
				else {

					var owner = this.ownerDocument || this.document;
					var view = owner.defaultView || owner.parentWindow;
					var selection = view.getSelection();

					range = selection.getRangeAt(0);

				};

				cursor.beforeRange = range.cloneRange();
				cursor.beforeRange.collapse(true);
				cursor.beforeRange.setStart(this, 0);

				cursor.beforeHTML = cursor.beforeRange.cloneContents();
				cursor.beforeText = cursor.beforeRange.toString();

				cursor.range = range.cloneRange();
				cursor.selectedHTML = cursor.range.cloneContents();
				cursor.selectedText = cursor.selectedHTML.textContent;

				cursor.afterRange = range.cloneRange();
				cursor.afterRange.collapse(false);
				cursor.afterRange.setEndAfter(this);

				cursor.afterHTML = cursor.afterRange.cloneContents();
				cursor.afterText = cursor.afterHTML.textContent;

				var cursorRangeEnd = cursor.range.cloneRange();
				cursorRangeEnd.selectNodeContents(this);
				cursorRangeEnd.setEnd(cursor.range.endContainer, cursor.range.endOffset);

				var cursorRangeStart = cursor.range.cloneRange();
				cursorRangeStart.selectNodeContents(this);
				cursorRangeStart.setStart(cursor.range.startContainer, cursor.range.startOffset);

				if( isTrue(cursor.range.collapsed) ){

					cursor.collapsed = true;
					cursor.position = cursor.start = cursor.end = cursorRangeEnd.toString().length;
					cursor.selected = 0;

				}
				else {

					var totalLength = $(this).text()[0].length;

					cursor.collapsed = false;
					cursor.start = totalLength - cursorRangeStart.toString().length;
					cursor.position = cursor.end = cursorRangeEnd.toString().length;
					cursor.selected = cursor.end - cursor.start;

				};

				returned.push(cursor);

			});

			return returned;

		},
		clone: function(){

			var $this = Jo(this);

			var found = new Array();

			this.each(function(){

				found.push(this.cloneNode(true));

			});

			$this.found = found;
			$this.length = this.found.length;

			return $this;

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

						for( var node = 0, length = nodes.length; node < length; node++ ){
						
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
		insertBeforeTo: function( selector ){

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

						for( var node = 0, length = nodes.length; node < length; node++ ){

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
		insertAfterTo: function( selector ){

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

						for( var node = 0, length = nodes.length; node < length; node++ ){

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
		insertStartTo: function( selector ){

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

						for( var node = 0, length = nodes.length; node < length; node++ ){

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
			else if( isNodeList(html) ){

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
		insertEndTo: function( selector ){

			Jo(selector).insertEnd(this);

			return this;

		},
		wrap: function( html ){

			var $this = Jo(this);
			var $wrapper;

			if( isString(html) ){

				$wrapper = Jo(html);

			};

			this.each(function(){

				var $this = Jo(this);

				var $wrapped = $wrapper.clone();

				$this.insertBefore($wrapped);

				$wrapped.html($this);

			});

			return $this;

		},
		replace: function( html ){

			var $this = Jo(this);
			var found = new Array();

			if( isString(html) || isNumber(html) ){

				var temporaryNode = document.createElement("div");
				temporaryNode.innerHTML = html.toString();

				html = temporaryNode.childNodes;

				temporaryNode.remove();

			}
			else if( isNode(html) ){

				html = [html];

			}
			else if( isJo(html) ){

				html = html.found;

			};

			console.log("replace", html)

			this.each(function(){

				if( html.length === 1 ){

					console.log("UNIQUE");

					var node = html[0].cloneNode(true);
					console.log(node);

					this.parentNode.replaceChild(node, this);

				}
				else {

					var reference = this;

					for( var element = 0, length = html.length; element < length; element++ ){

						var node = html[element].cloneNode(true);

						found.push(node);

						Jo(reference).insertAfter(node);

						reference = node;

					};

				};

				// Jo(this).remove();

			});

			$this.found = found;
			$this.length = this.found.length;

			return $this;

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

				while( this.lastChild ){

					this.removeChild(this.lastChild);

				};

			});

			return this;

		},
		show: function(){

			this.each(function(){

				if( !isEmpty(Jo(this).data("jo-display")[0]) ){

					this.style.display = Jo(this).data("jo-display");
					delete this.data["jo-display"];

				}
				else {

					this.style.display = "";

				};

			});

			return this;

		},
		hide: function(){

			this.each(function(){

				Jo(this).data("jo-display", this.style.display);
				this.style.display = "none";

			});

			return this;

		},
		fadeIn: function( options ){

			options = Jo.merge({
				duration: 1000,
				easing: "linear"
			}, options);

			this
				.css("opacity", 0)
				.show()
				.animate({
					opacity: 1
				}, {
					duration: options.duration,
					easing: options.easing,
					complete: function(){

						if( isFunction(options.complete) ){

							options.complete();

						};

					}
				});

			return this;

		},
		fadeOut: function( options ){

			options = Jo.merge({
				duration: 1000,
				easing: "linear"
			}, options);

			this
				.animate({
					opacity: 0
				}, {
					duration: options.duration,
					easing: options.easing,
					complete: function(){

						Jo(this).hide();

						if( isFunction(options.complete) ){

							options.complete();

						};

					}
				});

		},
		animate: function( styles, options ){

			options = Jo.merge({
				duration: 1000,
				easing: "linear"
			}, options);

			// Check CSS property only one time, then, create a task, store current css
			// 'DOMSubtreeModified' can trigger when dom change
			// cache generated valuesTO !!!

			var valuesTo = new Object();

			for( var property in styles ){

				if( styles.hasOwnProperty(property) ){

					valuesTo[property] = new Object();
					valuesTo[property].values = new Array();

					valuesTo[property].model = styles[property].toString()
						.replace(regularExpressions.length, function( match, number, unit ){

							var index = valuesTo[property].values.push({
								from: null,
								to: parseFloat(number),
								difference: 0,
								unit: unit
							});

							return "#" + (index - 1);

						})
						.replace(regularExpressions.hexaColor, function( match, red, green, blue ){

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
						.replace(regularExpressions.RGBColor, function( match, red, green, blue, alpha ){

							if( isEmpty(alpha) ){

								alpha = 1;

							};

							var redIndex = valuesTo[property].values.push({
								from: null,
								to: parseInt(red),
								difference: 0,
								unit: "",
								integer: true
							});

							var greenIndex = valuesTo[property].values.push({
								from: null,
								to: parseInt(green),
								difference: 0,
								unit: "",
								integer: true
							});

							var blueIndex = valuesTo[property].values.push({
								from: null,
								to: parseInt(blue),
								difference: 0,
								unit: "",
								integer: true
							});

							var alphaIndex = valuesTo[property].values.push({
								from: null,
								to: parseInt(alpha),
								difference: 0,
								unit: ""
							});

							return "rgba(#" + (redIndex - 1) + ", #" + (greenIndex - 1) + ", #" + (blueIndex - 1) + ", #" + (alphaIndex - 1) + ")";

						})
						.replace(/(?!#)\d+/g, function( match ){

							// var index = valuesTo[property].values.push({
							// 	from: null,
							// 	to: parseFloat(number),
							// 	difference: 0,
							// 	unit: ""
							// });

							// return "#" + (index - 1);

						});

					var preparedProperty = prepareCSSProperty(property, styles[property]);

					if( preparedProperty !== property ){

						styles[preparedProperty] = styles[property];
						delete styles[property];

					};

				};

			};

			var currentStyles = this.css();

			var task = {
				this: this,
				elements: new Array(),
				options: options
			};

			this.each(function( index ){

				var element = {
					$element: Jo(this),
					properties: new Object()
				};

				for( var property in styles ){

					if( styles.hasOwnProperty(property) ){


						var uncamelizedProperty = uncamelize(property);

						var from = currentStyles[index].getPropertyValue(uncamelizedProperty);
						var model = valuesTo[property].model;
						var values = valuesTo[property].values;

						if( from === "auto" && !isEmpty(this[camelize("offset-" + property)]) ){

							from = this[camelize("offset-" + property)] + "px";

						}
						else if( from === "none" ){

							if( property === "transform" ){

								from = "matrix(1, 0, 0, 1, 0, 0)";

							}
							else {

								from = "0";

							};

						};

						var valueIndex = -1;
						from
							.replace(regularExpressions.length, function( match, number, unit ){

								valueIndex++;

								var convertedValue = convertCSSValue(this, property, number, unit, valuesTo[property].values[valueIndex].unit);

								values[valueIndex].from = convertedValue;
								values[valueIndex].difference = Math.abs(convertedValue - values[valueIndex].to) * (convertedValue > values[valueIndex].to ? -1 : 1);

								return "#" + (valueIndex - 1);

							}.bind(this))
							.replace(regularExpressions.RGBColor, function( match, red, green, blue, alpha ){

								if( isEmpty(alpha) ){

									alpha = 1;

								};

								var redValue = parseInt(red);
								values[++valueIndex].from = redValue;
								values[valueIndex].difference = Math.abs(redValue - values[valueIndex].to) * (redValue > values[valueIndex].to);

								var greenValue = parseInt(green);
								values[++valueIndex].from = greenValue;
								values[valueIndex].difference = Math.abs(greenValue - values[valueIndex].to) * (greenValue > values[valueIndex].to);

								var blue = parseInt(blue);
								values[++valueIndex].from = blue;
								values[valueIndex].difference = Math.abs(blue - values[valueIndex].to) * (blue > values[valueIndex].to);

								var alphaValue = parseInt(alpha);
								values[++valueIndex].from = alphaValue;
								values[valueIndex].difference = Math.abs(alphaValue - values[valueIndex].to) * (alphaValue > values[valueIndex].to);

								return "#" + (valueIndex - 1);

							});

						element.properties[property] = {
							model: valuesTo[property].model,
							values: valuesTo[property].values
						};

					};

				};

				task.elements.push(element);

			});

			Animations.add(task);

			return this;

			/*


///
			options = Jo.merge({
				duration: 1000,
				easing: "linear"
			}, options);

			this.each(function(){

				var $this = Jo(this);

				if( isEmpty(this.animation) ){

					this.animation = {
						options: options,
						properties: new Object()
					};

				};

				for( var property in styles ){

					if( styles.hasOwnProperty(property) ){

						var uncamelizedProperty = uncamelize(property);

						this.animation.properties[property] = {
							from: {
								origin: $this.css(uncamelizedProperty)[0],
								values: new Array()
							},
							to: {
								origin: styles[property],
								values: new Array(),
								differences: new Array()
							}
						};

						if( this.animation.properties[property].from.origin === "auto" && !isEmpty(this[camelize("offset-" + property)]) ){

							this.animation.properties[property].from.origin = this[camelize("offset-" + property)] + "px";

						}
						else if( this.animation.properties[property].from.origin === "none" ){

							this.animation.properties[property].from.origin = "0";

						};

						if( isNumber(this.animation.properties[property].to.origin) ){

							this.animation.properties[property].to.origin = this.animation.properties[property].to.origin.toString();

						};

						this.animation.properties[property].model = this.animation.properties[property].to.origin
							.replace(regexp.length, function( match, number, type ){

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

								}
								else if( type === "%" ){

									number = $this.parent().width() / 100 * number

								};

								var index = this.animation.properties[property].to.values.push({
									number: number,
									type: type
								});


								return "#" + (index - 1);

							}.bind(this))
							.replace(regexp.hexColor, function( match, red, green, blue ){

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
							.replace(regexp.RGBColor, function( match, red, green, blue, alpha ){

								if( isEmpty(alpha) ){

									alpha = 1;

								};

								var redIndex = this.animation.properties[property].to.values.push({
									number: parseInt(red),
									precision: "integer"
								});

								var greenIndex = this.animation.properties[property].to.values.push({
									number: parseInt(green),
									precision: "integer"
								});

								var blueIndex = this.animation.properties[property].to.values.push({
									number: parseInt(blue),
									precision: "integer"
								});

								var alphaIndex = this.animation.properties[property].to.values.push({
									number: parseFloat(alpha)
								});

								return "rgba(#" + (redIndex - 1) + ", #" + (greenIndex - 1) + ", #" + (blueIndex - 1) + ", #" + (alphaIndex - 1) + ")";

							});

						this.animation.properties[property].from.origin
							.replace(regexp.length, function( match, number, type ){

								var index = this.animation.properties[property].from.values.push(new Object());

								number = parseFloat(match);

								if( type !== this.animation.properties[property].to.values[index - 1].type ){

									var toNumber = this.animation.properties[property].to.values[index - 1].number;
									var toType = this.animation.properties[property].to.values[index - 1].type;

									if( toType === "px" ){

										number = parseFloat(window.getComputedStyle(this, null).getPropertyValue(property));
										type = "px";

									}
									else if( toType === "%" ){

										number = number / parseFloat(window.outerWidth) * 100;
										type = "%";

									};

								};

								this.animation.properties[property].from.values[index - 1].number = number;
								this.animation.properties[property].from.values[index - 1].type = type;

								return false;

							}.bind(this))
							.replace(regexp.RGBColor, function( match, red, green, blue, alpha ){

								if( isEmpty(alpha) ){

									alpha = 1;

								};

								var redIndex = this.animation.properties[property].from.values.push({
									number: parseInt(red),
									precision: "integer"
								});

								var greenIndex = this.animation.properties[property].from.values.push({
									number: parseInt(green),
									precision: "integer"
								});

								var blueIndex = this.animation.properties[property].from.values.push({
									number: parseInt(blue),
									precision: "integer"
								});

								var alphaIndex = this.animation.properties[property].from.values.push({
									number: parseFloat(alpha)
								});

								return false;

							});

						for( var value = 0; value < this.animation.properties[property].to.values.length; value++ ){

							var difference = Math.abs(this.animation.properties[property].from.values[value].number - this.animation.properties[property].to.values[value].number);

							if( this.animation.properties[property].from.values[value].number > this.animation.properties[property].to.values[value].number ){

								difference = -difference;

							};

							this.animation.properties[property].to.differences.push(difference);

						};

					};

				};

				this.animation.fn = function( now ){

					if( isEmpty(this.animation.times.start) ){

						this.animation.times.start = now;

					};

					this.animation.times.elapsed = now - this.animation.times.start;

					if( this.animation.times.elapsed > options.duration ){

						this.animation.times.elapsed = options.duration;

					};

					for( var property in this.animation.properties ){

						if( this.animation.properties.hasOwnProperty(property) ){

							if( this.animation.times.elapsed < options.duration ){

								this.animation.properties[property].progress = this.animation.properties[property].model;

								for( var value = 0; value < this.animation.properties[property].to.values.length; value++ ){

									var valueString = this.animation.properties[property].from.values[value].number + (Jo.easing[options.easing](this.animation.times.elapsed, options.duration) * this.animation.properties[property].to.differences[value]);

									if( this.animation.properties[property].from.values[value].precision === "integer" ){

										valueString = parseInt(valueString);

									};

									if( !isEmpty(this.animation.properties[property].to.values[value].type) ){

										valueString += this.animation.properties[property].to.values[value].type;

									};

									this.animation.properties[property].progress = this.animation.properties[property].progress.replace("#" + value, valueString);

								};

								$this.css(property, this.animation.properties[property].progress);

							}
							else {

								$this.css(property, this.animation.properties[property].to.origin);

							};

						};

					};

					if( this.animation.times.elapsed === options.duration ){

						cancelAnimationFrame(this.animation.id);

						if( isFunction(options.complete) ){

							options.complete.call(this);

						};

					}
					else {

						this.animation.id = window.requestAnimationFrame(this.animation.fn);

					};

				}.bind(this);

				this.animation.times = new Object();

				window.requestAnimationFrame(this.animation.fn);

				return this;

			});
//*/
		}
	};

	Jo.fn.init.prototype = Jo.fn;

	Jo.animation = function( fps, fn ){

		return new Jo.animation.fn.init(fps, fn);

	};

	Jo.animation.fn = Jo.animation.prototype = {
		constructor: Jo.animation,
		init: function( fps, fn ){

			this.active = false;
			this.fps = fps || 30;
			this.interval = 1000 / this.fps;
			this.now = 0;
			this.then = 0;
			this.deltaTime = 0;

			this.fn = fn;
			this.tasks = new Array();

			documentRoot.addEventListener("visibilitychange", function( event ){

				if( documentRoot.visibilityState === "visible" ){

					this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));

				}
				else {

					window.cancelAnimationFrame(this.animationFrame);

				};

			}.bind(this), false);

			this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));

			return this;

		},
		loop: function( now ){

			if( this.active === false ){

				return window.cancelAnimationFrame(this.animationFrame);

			};

			this.now = now;
			this.deltaTime = this.now - this.then;

			if( this.deltaTime > this.interval ){

				this.fn(now);

				this.then = now - (this.deltaTime % this.interval);

			};

			this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));

			return this;

		},
		each: function( fn ){

			for( var task = 0; task < this.tasks.length; task++ ){

				fn.call(this, this.tasks[task], task);

			};

			return this;

		},
		add: function( task ){

			task.each = function( fn ){

				for( var element = 0, length = task.elements.length; element < length; element++ ){

					fn.call(null, task.elements[element]);

				};

			};

			this.tasks.push(task);

			if( this.active === false ){

				this.active = true;
				this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));

			};

			return this;

		},
		remove: function( task ){

			if( isNumber(task) ){

				this.tasks.splice(task, 1);

			}
			else {

				this.tasks.filter(function( entry ){

					return entry !== task;

				});

			};

			if( this.tasks.length === 0 ){

				this.active = false;

			};

			return this;

		}
	};

	Jo.animation.fn.init.prototype = Jo.animation.fn;

	var Animations = Jo.animation(30, function( now ){

		this.each(function( task, index ){

			if( isEmpty(task.options.start) ){

				task.options.start = now;

			};

			var elapsedTime = now - task.options.start;

			if( elapsedTime >= task.options.duration ){

				elapsedTime = task.options.duration;

			};

			task.each(function( element ){

				for( var property in element.properties ){

					if( element.properties.hasOwnProperty(property) ){

						var currentProperty = element.properties[property];
						var model = currentProperty.model;

						for( var value = 0, length = currentProperty.values.length; value < length; value++ ){

							var newValue = (currentProperty.values[value].from + (Jo.easing[task.options.easing](elapsedTime, task.options.duration) * currentProperty.values[value].difference));

							if( isTrue(currentProperty.values[value].integer) ){

								newValue = parseInt(newValue);

							};

							model = model.replace("#" + value, newValue + element.properties[property].values[value].unit);

						};

						element.$element.css(property, model, false);

					};

				};

			});

			if( elapsedTime === task.options.duration ){

				if( isFunction(task.options.complete) ){

					task.options.complete.call(task.this);

				};

				this.remove(index);

			};

		});

	});

	Jo.matrix = function( matrix ){

		return new Jo.matrix.fn.init(matrix);

	};

	Jo.matrix.fn = Jo.matrix.prototype = {
		constructor: Jo.matrix,
		init: function( matrix ){

			this.default = {
				m00: 1,
				m01: 0,
				m02: 0,
				m03: 0,
				m10: 0,
				m11: 1,
				m12: 0,
				m13: 0,
				m20: 0,
				m21: 0,
				m22: 1,
				m23: 0,
				m30: 0,
				m31: 0,
				m32: 0,
				m33: 1
			};

			if( isEmpty(matrix) ){

				this.copy(this.default);

			}
			else if( matrix.constructor === Jo.matrix ){

				this.matrix = new Object();

				for( var m in matrix.matrix ){

					if( matrix.matrix.hasOwnProperty(m) ){

						this.matrix[m] = matrix.matrix[m];

					};

				};

			}
			else if( isObject(matrix) ){

				this.copy(matrix);

			};
			
			return this;

		},
		setA: function( number ){

			this.matrix.m00 = number;

			return this;

		},
		getA: function(){

			return this.matrix.m00;

		},
		setB: function( number ){

			this.matrix.m10 = number;

			return this;

		},
		getB: function(){

			return this.matrix.m10;

		},
		setC: function( number ){

			this.matrix.m01 = number;

			return this;

		},
		getC: function(){

			return this.matrix.m01;

		},
		setD: function( number ){

			this.matrix.m11 = number;

			return this;

		},
		getD: function(){

			return this.matrix.m11;

		},
		setE: function( number ){

			this.matrix.m02 = number;

			return this;

		},
		getE: function(){

			return this.matrix.m02;

		},
		setF: function( number ){

			this.matrix.m12 = number;

			return this;

		},
		getF: function(){

			return this.matrix.m12;

		},
		scale: function( x, y, z ){

			y = y || x || 0;
			z = z || 1;

			this
				.scaleX(x)
				.scaleY(y)
				.scaleZ(z);

			return this;

		},
		scaleX: function( unit ){

			this.matrix.m00 *= unit;
			this.matrix.m01 *= unit;
			this.matrix.m02 *= unit;
			this.matrix.m03 *= unit;

			return this;

		},
		scaleY: function( unit ){

			this.matrix.m10 *= unit;
			this.matrix.m11 *= unit;
			this.matrix.m12 *= unit;
			this.matrix.m13 *= unit;

			return this;

		},
		scaleZ: function( unit ){

			this.matrix.m20 *= unit;
			this.matrix.m21 *= unit;
			this.matrix.m22 *= unit;
			this.matrix.m23 *= unit;

			return this;

		},
		getScale: function(){

			return {
				x: Math.sqrt(this.matrix.m00 * this.matrix.m00 + this.matrix.m10 * this.matrix.m10),
				y: Math.sqrt(this.matrix.m01 * this.matrix.m01 + this.matrix.m11 * this.matrix.m11),
				z: Math.sqrt(this.matrix.m02 * this.matrix.m02 + this.matrix.m12 * this.matrix.m12)
			};

		},
		translate: function( x, y, z ){

			var clone = Jo.matrix().matrix;

			// ignore other transforms
			clone.m30 += x;
			clone.m31 += y;
			clone.m32 += z;

			// Mix with other transforms
			// clone.m30 = this.matrix.m00 * x + this.matrix.m10 * y + this.matrix.m20 * z + this.matrix.m30;
			// clone.m31 = this.matrix.m01 * x + this.matrix.m11 * y + this.matrix.m21 * z + this.matrix.m31
			// clone.m32 = this.matrix.m02 * x + this.matrix.m03 * y + this.matrix.m22 * z + this.matrix.m32;
			clone.m33 = this.matrix.m03 * x + this.matrix.m13 * y + this.matrix.m23 * z + this.matrix.m33;

			this.multiply(clone);

			return this;

		},
		translateX: function( pixels ){

			this.translate(pixels, 0, 0);

			return this;

		},
		translateY: function( pixels ){

			this.translate(0, pixels, 0);

			return this;

		},
		translateZ: function( pixels ){

			this.translate(0, 0, pixels);

			return this;

		},
		getTranslation: function(){

			return {
				x: this.matrix.m30,
				y: this.matrix.m13,
				z: this.matrix.m23
			};

		},
		skew: function( x, y ){

			this
				.skewX(x)
				.skewY(y);

			return this;

		},
		skewX: function( degrees ){

			var matrix = Jo.matrix();

			matrix.matrix.m10 = degrees * Math.PI / 180;

			this.multiply(matrix.matrix);

			return this;

		},
		skewY: function( degrees ){

			var matrix = Jo.matrix();

			matrix.matrix.m01 = degrees * Math.PI / 180;

			this.multiply(matrix.matrix);

			return this;

		},
		rotate: function( x, y, z ){

			this
				.rotateX(x)
				.rotateY(y)
				.rotateZ(z);

			return this;

		},
		rotateX: function( degrees ){

			var radians = -degrees * Math.PI / 180;
			var cosine = Math.cos(radians);
			var sine = Math.sin(radians);

			var clone = this.clone().matrix;

			clone.m01 = cosine * this.matrix.m01 + sine * this.matrix.m02;
			clone.m02 = cosine * this.matrix.m02 - sine * this.matrix.m01;
			clone.m11 = cosine * this.matrix.m11 + sine * this.matrix.m12;
			clone.m12 = cosine * this.matrix.m12 - sine * this.matrix.m11;
			clone.m21 = cosine * this.matrix.m21 + sine * this.matrix.m22;
			clone.m22 = cosine * this.matrix.m22 - sine * this.matrix.m21;
			clone.m31 = cosine * this.matrix.m31 + sine * this.matrix.m32;
			clone.m32 = cosine * this.matrix.m32 - sine * this.matrix.m31;

			this.copy(clone);

			return this;

		},
		rotateY: function( degrees ){

			var radians = -degrees * Math.PI / 180;
			var cosine = Math.cos(radians);
			var sine = Math.sin(radians);

			var clone = this.clone().matrix;

			clone.m00 = cosine * this.matrix.m00 - sine * this.matrix.m02;
			clone.m02 = cosine * this.matrix.m02 + sine * this.matrix.m00;
			clone.m10 = cosine * this.matrix.m10 - sine * this.matrix.m12;
			clone.m12 = cosine * this.matrix.m12 + sine * this.matrix.m10;
			clone.m20 = cosine * this.matrix.m20 - sine * this.matrix.m22;
			clone.m22 = cosine * this.matrix.m22 + sine * this.matrix.m20;
			clone.m30 = cosine * this.matrix.m30 - sine * this.matrix.m32;
			clone.m32 = cosine * this.matrix.m32 + sine * this.matrix.m30;

			this.copy(clone);

			return this;

		},
		rotateZ: function( degrees ){

			var radians = -degrees * Math.PI / 180;
			var cosine = Math.cos(radians);
			var sine = Math.sin(radians);

			var clone = this.clone().matrix;

			clone.m00 = cosine * this.matrix.m00 + sine * this.matrix.m01;
			clone.m01 = cosine * this.matrix.m01 - sine * this.matrix.m00;
			clone.m10 = cosine * this.matrix.m10 + sine * this.matrix.m11;
			clone.m11 = cosine * this.matrix.m11 - sine * this.matrix.m10;
			clone.m20 = cosine * this.matrix.m20 + sine * this.matrix.m21;
			clone.m21 = cosine * this.matrix.m21 - sine * this.matrix.m20;
			clone.m30 = cosine * this.matrix.m30 + sine * this.matrix.m31;
			clone.m31 = cosine * this.matrix.m31 - sine * this.matrix.m30;

			this.copy(clone);

			return this;

		},
		rotate3d: function( x, y, z, degrees ){

			if( x !== 0 ){

				this.rotateX((x < 0) ? -degrees : degrees);

			};

			if( y !== 0 ){

				this.rotateY((y < 0) ? -degrees : degrees);

			};

			if( z !== 0 ){

				this.rotateZ((z < 0) ? -degrees : degrees);

			};

			return this;

		},
		getRotation: function(){

			var rotationX = Math.atan2(this.matrix.m21, this.matrix.m22);
			var rotationY = Math.asin(-this.matrix.m20);
			var rotationZ = Math.atan2(this.matrix.m10, this.matrix.m00);

			if( Math.cos(rotationY) === 0 ){

				rotationX = Math.atan2(-this.matrix.m02, this.matrix.m22);
				rotationZ = 0;

			};

			return {
				x: rotationX * 180 / Math.PI,
				y: rotationY * 180 / Math.PI,
				z: rotationZ * 180 / Math.PI,
			};

		},
		add: function( matrix ){

			if( !isEmpty(matrix) ){

				if( matrix.constructor === Jo.matrix ){

					return this.multiply(matrix.matrix);

				}
				else if( isObject(matrix) ){

					return this.multiply(matrix);

				}
				else {

					var transforms = matrix.match(/((scale|scaleX|scaleY|scaleZ|scale3d|rotate|rotateX|rotateY|rotateZ|rotate3d|translate|translateX|translateY|translateZ|translate3d|matrix|matrix3d)\([^\)]*\))/g);

					for( var transform = 0, length = transforms.length; transform < length; transform++ ){

						var values = transforms[transform].match(/\-?\s*\d+(\.\d+)?/g);

						if( /^scale\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.scaleX(parseFloat(values[0]));

							};

							if( !isEmpty(values[1]) ){

								this.scaleX(parseFloat(values[1]));

							};

						}
						else if( /^scaleX\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.scaleX(parseFloat(values[0]));

							};

						}
						else if( /^scaleY\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.scaleY(parseFloat(values[0]));

							};

						}
						else if( /^scaleZ\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.scaleX(parseFloat(values[0]));

							};

						}
						else if( /^translate\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.translateX(parseFloat(values[0]));

							};

							if( !isEmpty(values[1]) ){

								this.translateY(parseFloat(values[1]));

							};

						}
						else if( /^translateX\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.translateX(parseFloat(values[0]));

							};

						}
						else if( /^translateY\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.translateY(parseFloat(values[0]));

							};

						}
						else if( /^translateZ\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.translateZ(parseFloat(values[0]));

							};

						}
						else if( /^translate3d\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) && !isEmpty(values[1]) && !isEmpty(values[2]) ){

								this.translate(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));

							};

						}
						else if( /^skew\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.skewX(parseFloat(values[0]));

							};

							if( !isEmpty(values[1]) ){

								this.skewY(parseFloat(values[1]));

							};

						}
						else if( /^skewX\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.skewX(parseFloat(values[0]));

							};

						}
						else if( /^skewY\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.skewY(parseFloat(values[0]));

							};

						}
						else if( /^rotate(\(|\Z\()/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.rotateZ(parseFloat(values[0]));

							};

						}
						else if( /^rotateX\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.rotateX(parseFloat(values[0]));

							};

						}
						else if( /^rotateY\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								this.rotateY(parseFloat(values[0]));

							};

						}
						else if( /^rotate3d\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) && !isEmpty(values[1]) && !isEmpty(values[2]) && !isEmpty(values[3]) ){

								this.rotate3d(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]));

							};

						}
						else if( /^matrix3d/.test(transforms[transform]) ){

							var mat = {
								m00: parseFloat(values[1]) || 1,
								m01: parseFloat(values[2]) || 0,
								m02: parseFloat(values[3]) || 0,
								m03: parseFloat(values[4]) || 0,
								m10: parseFloat(values[5]) || 0,
								m11: parseFloat(values[6]) || 1,
								m12: parseFloat(values[7]) || 0,
								m13: parseFloat(values[8]) || 0,
								m20: parseFloat(values[9]) || 0,
								m21: parseFloat(values[10]) || 0,
								m22: parseFloat(values[11]) || 1,
								m23: parseFloat(values[12]) || 0,
								m30: parseFloat(values[13]) || 0,
								m31: parseFloat(values[14]) || 0,
								m32: parseFloat(values[15]) || 0,
								m33: parseFloat(values[16]) || 1
							};

							console.log("this", this.toString());
							console.log("add", transforms[transform], values);
							console.log(mat);

							this.multiply(mat);

							console.log("aftr", this.toString());

						};

					};

					return this;

				};

			}
			else {

				return this;

			};

		},
		multiply: function( matrix ){

			var clone = this.clone().matrix;

			clone.m00 = this.matrix.m00 * matrix.m00 + this.matrix.m01 * matrix.m10 + this.matrix.m02 * matrix.m20 + this.matrix.m03 * matrix.m30;
			clone.m01 = this.matrix.m00 * matrix.m01 + this.matrix.m01 * matrix.m11 + this.matrix.m02 * matrix.m21 + this.matrix.m03 * matrix.m31;
			clone.m02 = this.matrix.m00 * matrix.m02 + this.matrix.m01 * matrix.m12 + this.matrix.m02 * matrix.m22 + this.matrix.m03 * matrix.m32;
			clone.m03 = this.matrix.m00 * matrix.m03 + this.matrix.m01 * matrix.m13 + this.matrix.m02 * matrix.m23 + this.matrix.m03 * matrix.m33;

			clone.m10 = this.matrix.m10 * matrix.m00 + this.matrix.m11 * matrix.m10 + this.matrix.m12 * matrix.m20 + this.matrix.m13 * matrix.m30;
			clone.m11 = this.matrix.m10 * matrix.m01 + this.matrix.m11 * matrix.m11 + this.matrix.m12 * matrix.m21 + this.matrix.m13 * matrix.m31;
			clone.m12 = this.matrix.m10 * matrix.m02 + this.matrix.m11 * matrix.m12 + this.matrix.m12 * matrix.m22 + this.matrix.m13 * matrix.m32;
			clone.m13 = this.matrix.m10 * matrix.m03 + this.matrix.m11 * matrix.m13 + this.matrix.m12 * matrix.m23 + this.matrix.m13 * matrix.m33;

			clone.m20 = this.matrix.m20 * matrix.m00 + this.matrix.m21 * matrix.m10 + this.matrix.m22 * matrix.m20 + this.matrix.m23 * matrix.m30;
			clone.m21 = this.matrix.m20 * matrix.m01 + this.matrix.m21 * matrix.m11 + this.matrix.m22 * matrix.m21 + this.matrix.m23 * matrix.m31;
			clone.m22 = this.matrix.m20 * matrix.m02 + this.matrix.m21 * matrix.m12 + this.matrix.m22 * matrix.m22 + this.matrix.m23 * matrix.m32;
			clone.m23 = this.matrix.m20 * matrix.m03 + this.matrix.m21 * matrix.m13 + this.matrix.m22 * matrix.m23 + this.matrix.m23 * matrix.m33;

			clone.m30 = this.matrix.m30 * matrix.m00 + this.matrix.m31 * matrix.m10 + this.matrix.m32 * matrix.m20 + this.matrix.m33 * matrix.m30;
			clone.m31 = this.matrix.m30 * matrix.m01 + this.matrix.m31 * matrix.m11 + this.matrix.m32 * matrix.m21 + this.matrix.m33 * matrix.m31;
			clone.m32 = this.matrix.m30 * matrix.m02 + this.matrix.m31 * matrix.m12 + this.matrix.m32 * matrix.m22 + this.matrix.m33 * matrix.m32;
			clone.m33 = this.matrix.m30 * matrix.m03 + this.matrix.m31 * matrix.m13 + this.matrix.m32 * matrix.m23 + this.matrix.m33 * matrix.m33;

			this.copy(clone);

			return this;

		},
		inverse: function(){

			this.matrix.m00 = this.matrix.m12 * this.matrix.m23 * this.matrix.m31 - this.matrix.m13 * this.matrix.m22 * this.matrix.m31 + this.matrix.m13 * this.matrix.m21 * this.matrix.m32 - this.matrix.m11 * this.matrix.m23 * this.matrix.m32 - this.matrix.m12 * this.matrix.m21 * this.matrix.m33 + this.matrix.m11 * this.matrix.m22 * this.matrix.m33;
			this.matrix.m01 = this.matrix.m03 * this.matrix.m22 * this.matrix.m31 - this.matrix.m02 * this.matrix.m23 * this.matrix.m31 - this.matrix.m03 * this.matrix.m21 * this.matrix.m32 + this.matrix.m01 * this.matrix.m23 * this.matrix.m32 + this.matrix.m02 * this.matrix.m21 * this.matrix.m33 - this.matrix.m01 * this.matrix.m22 * this.matrix.m33;
			this.matrix.m02 = this.matrix.m02 * this.matrix.m13 * this.matrix.m31 - this.matrix.m03 * this.matrix.m12 * this.matrix.m31 + this.matrix.m03 * this.matrix.m11 * this.matrix.m32 - this.matrix.m01 * this.matrix.m13 * this.matrix.m32 - this.matrix.m02 * this.matrix.m11 * this.matrix.m33 + this.matrix.m01 * this.matrix.m12 * this.matrix.m33;
			this.matrix.m03 = this.matrix.m03 * this.matrix.m12 * this.matrix.m21 - this.matrix.m02 * this.matrix.m13 * this.matrix.m21 - this.matrix.m03 * this.matrix.m11 * this.matrix.m22 + this.matrix.m01 * this.matrix.m13 * this.matrix.m22 + this.matrix.m02 * this.matrix.m11 * this.matrix.m23 - this.matrix.m01 * this.matrix.m12 * this.matrix.m23;
			this.matrix.m10 = this.matrix.m13 * this.matrix.m22 * this.matrix.m30 - this.matrix.m12 * this.matrix.m23 * this.matrix.m30 - this.matrix.m13 * this.matrix.m20 * this.matrix.m32 + this.matrix.m10 * this.matrix.m23 * this.matrix.m32 + this.matrix.m12 * this.matrix.m20 * this.matrix.m33 - this.matrix.m10 * this.matrix.m22 * this.matrix.m33;
			this.matrix.m11 = this.matrix.m02 * this.matrix.m23 * this.matrix.m30 - this.matrix.m03 * this.matrix.m22 * this.matrix.m30 + this.matrix.m03 * this.matrix.m20 * this.matrix.m32 - this.matrix.m00 * this.matrix.m23 * this.matrix.m32 - this.matrix.m02 * this.matrix.m20 * this.matrix.m33 + this.matrix.m00 * this.matrix.m22 * this.matrix.m33;
			this.matrix.m12 = this.matrix.m03 * this.matrix.m12 * this.matrix.m30 - this.matrix.m02 * this.matrix.m13 * this.matrix.m30 - this.matrix.m03 * this.matrix.m10 * this.matrix.m32 + this.matrix.m00 * this.matrix.m13 * this.matrix.m32 + this.matrix.m02 * this.matrix.m10 * this.matrix.m33 - this.matrix.m00 * this.matrix.m12 * this.matrix.m33;
			this.matrix.m13 = this.matrix.m02 * this.matrix.m13 * this.matrix.m20 - this.matrix.m03 * this.matrix.m12 * this.matrix.m20 + this.matrix.m03 * this.matrix.m10 * this.matrix.m22 - this.matrix.m00 * this.matrix.m13 * this.matrix.m22 - this.matrix.m02 * this.matrix.m10 * this.matrix.m23 + this.matrix.m00 * this.matrix.m12 * this.matrix.m23;
			this.matrix.m20 = this.matrix.m11 * this.matrix.m23 * this.matrix.m30 - this.matrix.m13 * this.matrix.m21 * this.matrix.m30 + this.matrix.m13 * this.matrix.m20 * this.matrix.m31 - this.matrix.m10 * this.matrix.m23 * this.matrix.m31 - this.matrix.m11 * this.matrix.m20 * this.matrix.m33 + this.matrix.m10 * this.matrix.m21 * this.matrix.m33;
			this.matrix.m21 = this.matrix.m03 * this.matrix.m21 * this.matrix.m30 - this.matrix.m01 * this.matrix.m23 * this.matrix.m30 - this.matrix.m03 * this.matrix.m20 * this.matrix.m31 + this.matrix.m00 * this.matrix.m23 * this.matrix.m31 + this.matrix.m01 * this.matrix.m20 * this.matrix.m33 - this.matrix.m00 * this.matrix.m21 * this.matrix.m33;
			this.matrix.m22 = this.matrix.m01 * this.matrix.m13 * this.matrix.m30 - this.matrix.m03 * this.matrix.m11 * this.matrix.m30 + this.matrix.m03 * this.matrix.m10 * this.matrix.m31 - this.matrix.m00 * this.matrix.m13 * this.matrix.m31 - this.matrix.m01 * this.matrix.m10 * this.matrix.m33 + this.matrix.m00 * this.matrix.m11 * this.matrix.m33;
			this.matrix.m23 = this.matrix.m03 * this.matrix.m11 * this.matrix.m20 - this.matrix.m01 * this.matrix.m13 * this.matrix.m20 - this.matrix.m03 * this.matrix.m10 * this.matrix.m21 + this.matrix.m00 * this.matrix.m13 * this.matrix.m21 + this.matrix.m01 * this.matrix.m10 * this.matrix.m23 - this.matrix.m00 * this.matrix.m11 * this.matrix.m23;
			this.matrix.m30 = this.matrix.m12 * this.matrix.m21 * this.matrix.m30 - this.matrix.m11 * this.matrix.m22 * this.matrix.m30 - this.matrix.m12 * this.matrix.m20 * this.matrix.m31 + this.matrix.m10 * this.matrix.m22 * this.matrix.m31 + this.matrix.m11 * this.matrix.m20 * this.matrix.m32 - this.matrix.m10 * this.matrix.m21 * this.matrix.m32;
			this.matrix.m31 = this.matrix.m01 * this.matrix.m22 * this.matrix.m30 - this.matrix.m02 * this.matrix.m21 * this.matrix.m30 + this.matrix.m02 * this.matrix.m20 * this.matrix.m31 - this.matrix.m00 * this.matrix.m22 * this.matrix.m31 - this.matrix.m01 * this.matrix.m20 * this.matrix.m32 + this.matrix.m00 * this.matrix.m21 * this.matrix.m32;
			this.matrix.m32 = this.matrix.m02 * this.matrix.m11 * this.matrix.m30 - this.matrix.m01 * this.matrix.m12 * this.matrix.m30 - this.matrix.m02 * this.matrix.m10 * this.matrix.m31 + this.matrix.m00 * this.matrix.m12 * this.matrix.m31 + this.matrix.m01 * this.matrix.m10 * this.matrix.m32 - this.matrix.m00 * this.matrix.m11 * this.matrix.m32;
			this.matrix.m33 = this.matrix.m01 * this.matrix.m12 * this.matrix.m20 - this.matrix.m02 * this.matrix.m11 * this.matrix.m20 + this.matrix.m02 * this.matrix.m10 * this.matrix.m21 - this.matrix.m00 * this.matrix.m12 * this.matrix.m21 - this.matrix.m01 * this.matrix.m10 * this.matrix.m22 + this.matrix.m00 * this.matrix.m11 * this.matrix.m22;

			this.scale(1 / this.getDeterminant());

			return this;

		},
		getDeterminant: function(){

			return (
				(this.matrix.m00 * this.matrix.m11 * this.matrix.m22 * this.matrix.m33)
				+ (this.matrix.m10 * this.matrix.m21 * this.matrix.m32 * this.matrix.m03)
				+ (this.matrix.m20 * this.matrix.m31 * this.matrix.m02 * this.matrix.m13)
				+ (this.matrix.m30 * this.matrix.m01 * this.matrix.m12 * this.matrix.m23)
			) - (
				(this.matrix.m03 * this.matrix.m12 * this.matrix.m21 * this.matrix.m30)
				+ (this.matrix.m13 * this.matrix.m22 * this.matrix.m31 * this.matrix.m00)
				+ (this.matrix.m23 * this.matrix.m32 * this.matrix.m01 * this.matrix.m10)
				+ (this.matrix.m33 * this.matrix.m02 * this.matrix.m11 * this.matrix.m20)
			);

		},
		clone: function(){

			return Jo.matrix(this.matrix);

		},
		copy: function( matrix ){

			this.matrix = new Object();

			for( var m in matrix ){

				if( matrix.hasOwnProperty(m) ){

					this.matrix[m] = matrix[m] || this.default[m];

				};

			};

			return this;

		},
		toString: function(){

			return "matrix3d("
				+ this.matrix.m00 + "," + this.matrix.m01 + "," + this.matrix.m02 + "," + this.matrix.m03 + ","
				+ this.matrix.m10 + "," + this.matrix.m11 + "," + this.matrix.m12 + "," + this.matrix.m13 + ","
				+ this.matrix.m20 + "," + this.matrix.m21 + "," + this.matrix.m22 + "," + this.matrix.m23 + ","
				+ this.matrix.m30 + "," + this.matrix.m31 + "," + this.matrix.m32 + "," + this.matrix.m33
			+ ")";

		},
		to2dString: function(){

			return "matrix(" + this.getA() + "," + this.getB() + "," + this.getC() + "," + this.getD() + "," + this.getE() + "," + this.getF() + ")";

		}
	};

	Jo.matrix.fn.init.prototype = Jo.matrix.fn;

	Jo.merge = function( returned ){

		if( !isArray(returned) && !isObject(returned) ){

			if( !isEmpty(arguments[1]) && isArray(arguments[1]) ){

				returned = new Array();

			}
			else {

				returned = new Object();
				
			};

		};

		for( var argument = 1, length = arguments.length; argument < length; argument++ ){

			for( var key in arguments[argument] ){

				if( arguments[argument].hasOwnProperty(key) ){

					if( isObject(arguments[argument][key]) && (arguments[argument][key].constructor === Object || arguments[argument][key].constructor === Array) ){

						returned[key] = Jo.merge(returned[key], arguments[argument][key]);

					}
					else {

						returned[key] = arguments[argument][key];

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

		for( var argument = 1; argument < arguments.length; argument++ ){

			var obj = arguments[argument];

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

	Jo.worker = function( settings ){

		return new Jo.worker.fn.init(settings);

	};

	Jo.worker.fn = Jo.worker.prototype = {
		constructor: Jo.worker,
		init: function( settings ){

			settings = Jo.merge({
				console: true
			}, settings);

			if( isFunction(settings.code) ){

				if( !isEmpty(settings.parameters) ){

					for( var key = 0, length = settings.parameters.length; key < length; key++ ){

						settings.parameters[key] = doubleQuote(settings.parameters[key].toString());

					};

				};

				var code = "(" + settings.code + ")(" + settings.parameters.toString() + ")";

				settings.url = Jo.blob(code, "text/javascript").toURL();

			};

			this.worker = new Worker(settings.url);

			this.events = new Object();

			this.worker.addEventListener("message", function( message ){

				if( isFunction(settings.receive) ){

					settings.receive.call(this, message);

				};

				if( !isEmpty(message.data) ){

					if( !isEmpty(message.data.type) ){

						if( message.data.type === "console" && isTrue(settings.console) ){

							console[message.data.content.type].apply(console, message.data.content.content);

						};

						for( var action in this.events ){

							if( this.events.hasOwnProperty(action) && action === message.data.type ){

								for( var evt in this.events[action] ){

									this.events[action][evt].call(this, message);

								};

							};

						};

					};

				};

			}.bind(this), false);

			this.worker.addEventListener("error", function( message, file, line ){

				if( isFunction(settings.error) ){

					settings.error.call(this, message, file, line);

				};

			}.bind(this), false);

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

	Jo.ajax = function( settings ){

		return new Jo.ajax.fn.init(settings);

	};

	Jo.ajax.fn = Jo.ajax.prototype = {
		constructor: Jo.ajax,
		init: function( settings ){

			settings = Jo.merge({
				method: "GET",
				async: true,
				type: "text/xml"
			}, settings);

			var data = null;

			if( settings.data ){

				if( settings.method === "GET" || settings.type === "jsonp" ){

					data = new Array()

					if( settings.data.constructor === FormData ){

						data.push(encodeURIComponent("error") + "=" + encodeURIComponent("FormData object cant be send with GET method"));

					}
					else if( isJo(settings.data) ){

						settings.data.find("[name]").each(function(){

							if( Jo(this).is("[type='file']") ){

								for( var file = 0, length = this.files.length; file < length; file++ ){

									data.push(encodeURIComponent(this.getAttribute("name") + "[" + file + "]") + "=" + encodeURIComponent(this.files[file]));

								};

							}
							else {

								data.push(encodeURIComponent(this.getAttribute("name")) + "=" + encodeURIComponent(this.value));

							};

						});

					}
					else if( isObject(settings.data) ){

						for( var key in settings.data ){

							if( settings.data.hasOwnProperty(key) ){

								data.push(encodeURIComponent(key) + "=" + encodeURIComponent(settings.data[key]));

							};

						};

					};

				}
				else {

					if( settings.data.constructor === FormData ){

						data = settings.data;

					}
					else if( isJo(settings.data) ){

						if( settings.data.is("form") ){

							data = new FormData(settings.data.found[0]);

						}
						else {

							data = new FormData();

							settings.data.find("[name]").each(function(){

								if( Jo(this).is("[type='file']") ){

									for( var file = 0, length = this.files.length; file < length; file++ ){

										data.append(this.getAttribute("name") + "[" + file + "]", this.files[file]);

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

				};

			};

			if( settings.type !== "jsonp" ){

				this.request = new XMLHttpRequest();

				this.request.overrideMimeType(settings.type);

				if( this.request.readyState === 0 ){

					settings.initialize(this.request);

				};

				this.request.addEventListener("readystatechange", function(){

					if( this.readyState === 1 ){

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

						if( isFunction(settings.complete) ){

							settings.complete(this);

						};

						if( this.status >= 200 && this.status < 400 ){

							if( isFunction(settings.success) ){

								settings.success(this);

								delete this;

							};

						}
						else if( this.readyState >= 400 ){

							if( isFunction(settings.error) ){

								settings.error(this);

							};

						};

					};

				}, false);

				this.request.addEventListener("progress", function( event ){

					if( isFunction(settings.progress) ){

						settings.progress(event.loaded, event.total);

					};

				}, false);

				this.request.upload.addEventListener("progress", function( event ){

					if( isFunction(settings) ){

						settings.progress(event.loaded, event.total);
						
					};

				}, false);

				this.request.addEventListener("error", function(){

					if( isFunction(settings.error) ){

						settings.error(this);

					};

				}, false);

				this.request.addEventListener("abort", function(){

					if( isFunction(settings.abort) ){

						settings.abort(this);

					};

				}, false);

				this.request.open(settings.method, settings.url + (settings.method === "GET" && !isEmpty(data) ? "?" + data.join("&") : ""), settings.async);

				this.sended = true;
				this.request.send(settings.method === "POST" ? data : null);

			}
			else {

				this.request = document.createElement("script");
				this.request.setAttribute("type", "text/javascript");

				this.request.addEventListener("load", function(){

					if( isFunction(settings.success) ){

						settings.success(this);

					};

				}, false);

				this.request.addEventListener("error", function(){

					if( isFunction(settings.error) ){

						settings.error(this);

					};

				}, false);

				var callback = "jsonp_callback_" + Math.round(100000 * Math.random());

				window[callback] = function( data ){

					delete window[callback];

					document.body.removeChild(this.request);

					if( isFunction(settings.success) ){

						settings.success(data);

					};

				}.bind(this);

				this.request.src = settings.url + "?callback=" + callback + (!isEmpty(data) ? "&" + data.join("&") : "");

				document.body.appendChild(this.request);

			};

			return this;

		},
		abort: function(){

			this.request.abort();

			return this;

		}
	};

	Jo.ajax.fn.init.prototype = Jo.ajax.fn;

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

	Jo.blob = function( data, type, bypass ){

		return new Jo.blob.fn.init(data, type, bypass);

	};

	Jo.blob.fn = Jo.blob.prototype = {
		constructor: Jo.blob,
		init: function( data, type, bypass ){

			if( !isArray(data) ){

				data = [data];

			};

			this.blob = new Blob(data, {
				type: type
			});

			return this;

		},
		toURL: function(){

			return window.URL.createObjectURL(this.blob);

		}
	};

	Jo.blob.fn.init.prototype = Jo.blob.fn;

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

	Jo.support = {

		events: function( element, event ){

			if( event in element || "on" + event in element ){

				return true;

			}
			else {

				return false;

			};

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

			if( elapsed === 0 ){

				return 0;

			}
			else if( (elapsed /= duration) === 1 ){

				return 1;

			}
			else {

				var progress = duration * 0.3;
				var speed = progress / (2 * Math.PI) * Math.asin(1);

				return -(1 * Math.pow(2, 10 * (elapsed -= 1)) * Math.sin((elapsed * duration - speed) * (2 * Math.PI) / progress));

			};

		},
		easeOutElastic: function( elapsed, duration ){

			if( elapsed === 0 ){

				return 0;

			}
			else if( (elapsed /= duration) == 1 ){

				return 1;

			}
			else {

				var progress = duration * 0.3;;
				var speed = progress / (2 * Math.PI) * Math.asin(1);

				return Math.pow(2, -10 * elapsed) * Math.sin((elapsed * duration - speed) * (2 * Math.PI) / progress) + 1;

			};


		},
		easeInOutElastic: function( elapsed, duration ){

			if( elapsed === 0){

				return 0;

			}
			else if( (elapsed /= duration / 2) === 2 ){

				return 1;

			}
			else {

				var progress = duration * (0.3 * 1.5);
				var speed = progress / (2 * Math.PI) * Math.asin(1);

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

	function isEmpty( source, emptyString ){

		if( (isObject(source) || isArray(source)) && !isFunction(source) ){

			for( var length in source ){

				return false;

			};

			return true;

		}
		else {

			return source === undefined || source === null || (emptyString === true && source === "");

		};

	};

	function isString( source ){

		return source instanceof String || typeof source === "string";

	};

	function isObject( source ){

		return source instanceof Object && typeof source === "object";

	};

	function isArray( source ){

		return source instanceof Array || typeof source === "array";

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

	function isNumber( source ){

		return typeof source === "number" || new RegExp("^[\\d\\.]+$", "gi").test(source) || (!isNaN(parseFloat(source)) && isFinite(source));

	};

	function isBoolean( source ){

		return typeof source === "boolean" || source === true || source === false;

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

		return !isEmpty(source) && (source instanceof HTMLElement || source.nodeType);

	};

	function isTag( source ){

		return !isEmpty(source) && isNode(source) && source.nodeType === 1;

	};

	function isText( source ){

		return !isEmpty(source) && isNode(source) && source.nodeType === 3;

	};

	function isNodeList( source ){

		return source instanceof HTMLCollection || source instanceof NodeList;

	};

	function isWindow( source ){

		return source instanceof Window;

	};

	function isJo( source ){

		return source instanceof Jo && typeof source === "object";

	};

	function isChildOf( children, parent ){

		return parent.contains ? parent.contains(children) : !!(parent.compareDocumentPosition(children) & 16);

	};

	function createNodes( html ){



	};

	function prepareSelector( selector ){

		var returned = selector.replace(/\s+/gi, " ").split(",");

		for( var key = 0, keyLength = returned.length; key < keyLength; key++ ){

			returned[key] = returned[key].split(/\s/gi);

			for( var subkey = 0, subkeyLength = returned[key].length; subkey < subkeyLength; subkey++ ){

				returned[key][subkey] = returned[key][subkey].replace(/([#\.:\[])([^#\.:\[\|\>]+)/gi, function(all, type, curiosity){

					if( type === "." &&  /\]$/gi.test(curiosity) ){

						return all;

					};

					return "|" + all;

				}).split("|");

				for( var lastkey = 0, lastkeyLength = returned[key][subkey].length; lastkey < lastkeyLength; lastkey++ ){

					returned[key][subkey][lastkey] = returned[key][subkey][lastkey].replace(/^:(first|last|nth|only)(-child|-of-type)?(\([0-9n\+\-]+\))?/gi, function(all, target, type, number){

						return ":" + target + (isEmpty(type) ? "-child" : type) + (isEmpty(number) ? "" : number);

					});

				};

				returned[key][subkey] = returned[key][subkey].join("");

			};

			returned[key] = returned[key].join(" ");

		};

		return returned.join(",");

	};

	function prepareCSSProperty( property ){

		var styles = window.getComputedStyle(document.body, null);

		if( isEmpty(styles.getPropertyValue(property)) && !isEmpty(styles.getPropertyValue(prefix.css + property)) ){

			property = prefix.css + property;

		};

		return property;

	};

	function convertCSSValue( element, property, value, from, to ){

		value = parseFloat(value);

		if( from === to ){

			return value;

		}
		else if( from === "%" ){

			if( to === "px" ){

				if( ["left", "width", "marginLeft", "marginRight", "borderLeft", "borderRight", "paddingLeft", "paddingRight"].indexOf(property) !== -1 ){

					return (element.parentElement.offsetWidth / 100 * value);

				}
				else {

					return (element.parentElement.offsetHeight / 100 * value);				

				};

			}
			else if( to === "em" ){

				return convertCSSValue(element, property, value, from, "px") / parseFloat(Jo(element).css("font-size")[0]);

			}
			else if( to === "rem" ){

				return convertCSSValue(element, property, value, from, "px") / parseFloat(Jo(document.documentElement).css("font-size")[0]);

			};

		}
		else if( from === "px" ){

			if( to === "%" ){



			};

		};

	};

	function getNodes( selector, element ){	

		var returned = new Array();

		if( isEmpty(element) ){

			element = document;

		}
		else if( !isTag(element) ){

			return returned;

		};

		selector = prepareSelector(selector);

		var elementId = element.id ? element.id : null;
		var removeIdAfter = false;
		var oldElement = element;
		var searchTextNode = /\btext\b\s*$/.test(selector) ? true : false;


		if( isTrue(searchTextNode) ){

			selector = selector.replace(/[\s>~]*text\s*$/gi, " *");

		};

		if( /^\s*>/gi.test(selector) ){

			if( isEmpty(elementId) ){

				removeIdAfter = true;
				elementId = element.id = "Jo_" + Math.random().toString(36).substr(2, 9) + new Date().getTime().toString(36);

			};

			selector = "#" + element.id + selector;
			element = document;

		};

		var nodes = element.querySelectorAll(selector);

		if( isTrue(removeIdAfter) ){

			oldElement.removeAttribute("id");

		};

		if( isTrue(searchTextNode) ){

			var elements = nodes;
			nodes = new Array();

			for( var element = 0, length = elements.length; element < length; element++ ){

				var walker = document.createTreeWalker(elements[element], NodeFilter.SHOW_TEXT, null, false);

				while( node = walker.nextNode() ){

					nodes.push(node);

				};

			};

		};

		for( var node = 0, length = nodes.length; node < length; node++ ){

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

		return text.replace(new RegExp("([a-z])(-\\s)*([A-Z])", "g"), "$1$3").toLowerCase();

	};

	function uncamelize( text ){

		return text.replace(new RegExp("([a-z])([A-Z])", "g"), "$1-$2").toLowerCase();

	};

	function quote( quote, text ){

		return quote + text + quote;

	};

	function singleQuote( text ){

		return quote("'", text.replace(/([\'\"])/g, "\\$1"));

	};

	function doubleQuote( text ){

		return quote('"', text.replace(/([\'\"])/g, "\\$1"));

	};

	var regularExpressions = {
		singleTag: /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		onlySpaces: /^\s+$/g,
		length: /(\d*\.?\d+)(em|ex|grad|ch|deg|ms|rad|rem|s|turn|vh|vw|vmin|vmax|px|cm|in|pt|pc|%)/gi, //!!! < ?
		RGBColor: /rgba?\(([0-9]{1,3})[,\s]{1,}([0-9]{1,3})[,\s]{1,}([0-9]{1,3})[,\s]{0,}([0-1]{1}\.?[0-9]*)?\)/gi,
		hexColor: /^#([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$/gi
	};

	var prefix = (function(){

		var styles = window.getComputedStyle(document.documentElement, "");

		var match = (Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/i) || (styles.OLink === "" && ["", "o"]))[1];

		var dom = ("WebKit|Moz|MS|O").match(new RegExp("(" + match + ")", "i"))[1];
		
		return {
			dom: dom,
			lowercase: match,
			css: "-" + match + "-",
			js: match[0].toUpperCase() + match.substr(1)
		};

	})();

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})(window);