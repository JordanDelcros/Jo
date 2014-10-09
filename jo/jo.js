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
		constructor: Jo,
		version: "0.1b",
		init: function( selector, context ){

			var found = new Array();

			if( !isEmpty(selector) ){
				
				if( isString(selector) ){

					if( selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" ){

						var singleTag = regularExpressions.singleTag.exec(selector);

						if( !isEmpty(singleTag) && singleTag.length > 0 ){

							found.push(document.createElement(singleTag[1]));

						}
						else {

							var temporary = temporaryNode.cloneNode(false);

							temporary.innerHTML = selector;

							for( var child = 0, length = temporary.childNodes.length; child < length; child++ ){

								found.push(temporary.childNodes[child]);

							};

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
				else if( isArray(selector) ){



				}
				else if( isJo(selector) ){

					found = Jo.clone(selector.found);

				}
				else if( isWindow(selector) ){

					found.push(window);

				}
				else if( isFunction(selector) ){

					if( document.readyState === "complete" ){

						selector.bind(this, Jo);

					}
					else {

						Jo(document).on("DOMContentLoaded", selector.bind(this, Jo), false);

					};
					
				};

			};

			this.selector = selector;
			this.found = found;
			this.length = found.length;
			this.previous = new Array();

			return this;

		},
		add: function( elements, selector ){

			var $this = Jo(this);

			var found = Jo.clone(this.found);

			Jo(elements).each(function(){

				if( isEmpty(selector) || Jo(this).is(selector) ){

					found.push(this);

				};

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		find: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				found = found.concat(getNodes(selector, this));

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		children: function( selector ){

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

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		parent: function( selector ){

			var $this = Jo(this);

			var found = new Array();

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

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

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

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		siblings: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			this.each(function(){

				var children = this.parentNode.children;

				for( var child = 0, length = children.length; child < length; child++ ){

					var $child = Jo(children[child]);

					if( !$child.is(this) ){

						if( !isEmpty(selector) ){

							if( $child.is(selector) ){

								found.push(children[child]);

							};

						}
						else {

							found.push(children[child]);

						};

					};

				};

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		siblingsBefore: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			this.each(function(){

				var $target = Jo(this);
				var children = this.parentNode.children;

				for( var child = 0, length = children.length; child < length; child++ ){

					var $child = Jo(children[child]);

					if( !$child.is($target) && $child.index() < $target.index() ){

						if( !isEmpty(selector) ){

							if( $child.is(selector) ){

								found.push(children[child]);

							};

						}
						else {

							found.push(children[child]);

						};

					};

				};

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		siblingsAfter: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			this.each(function(){

				var $target = Jo(this);
				var children = this.parentNode.children;

				for( var child = 0, length = children.length; child < length; child++ ){

					var $child = Jo(children[child]);

					if( !$child.is($target) && $child.index() > $target.index() ){

						if( !isEmpty(selector) ){

							if( $child.is(selector) ){

								found.push(children[child]);

							};

						}
						else {

							found.push(children[child]);

						};

					};

				};

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

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

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		item: function( number ){

			var $this = null;

			if( number <= this.found.length ){

				if( number < 0 ){

					number = this.found.length - number;

				};

				$this = Jo(this.found[number]);

			}
			else {

				$this = Jo();

			};

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = number;
			$this.previous = previous;

			return $this;

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

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		previousNode: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var target = this;

				while( !isEmpty(target.previousSibling) ){

					target = target.previousSibling;

					if( (!isEmpty(selector) && isString(selector) && Jo(target).is(selector)) || isEmpty(selector) ){

						found.push(target);
						break;

					};

				};

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

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

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		nextNode: function( selector ){

			var $this = Jo(this);

			var found = new Array();

			$this.each(function(){

				var target = this;

				while( !isEmpty(target.nextSibling) ){

					target = target.nextSibling;

					if( (!isEmpty(selector) && isString(selector) && Jo(target).is(selector)) || isEmpty(selector) ){

						found.push(target);
						break;

					};

				};

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

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

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.selector = selector;
			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		is: function( selector ){

			var returned = isEmpty(selector) ? false : true;

			if( isJo(selector) ){

				this.each(function(){

					if( selector.found.indexOf(this) === -1 ){

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

				if( !/(?:text|comment)\s*$/.test(selector) ){

					selector = prepareCSSSelector(selector, "fragment");

					this.each(function(){

						this.matches = (this.matches || this.matchesSelector || this.msMatchesSelector || this.mozMatchesSelector || this.webkitMatchesSelector || this.oMatchesSelector || function(){ return false });

						if( isFalse(this.matches(selector)) ){

							returned = false;

						};

					});

				}
				else {

					returned = this.is(Jo(selector));

				};
				
			};

			return returned;

		},
		on: function( actions, fn, useCapture ){

			actions = actions.split(/\s+/);

			if( isEmpty(useCapture) ){

				useCapture = false;

			};

			this.each(function(){

				if( !isObject(this.events) ){

					this.events = new Object();

				};

				for( var action = 0, length = actions.length; action < length; action++ ){

					var event = {
						originalAction: actions[action],
						action: actions[action],
						fn: fn
					};

					if( !isArray(this.events[event.action]) ){

						this.events[event.originalAction] = new Array();

					};

					var eventIndex = null;

					if( Jo.support.events(this, event.action) || !isFunction(specialEvents[actions[action]]) ){

						eventIndex = this.events[event.originalAction].push(event) - 1;

					}
					else {

						var specialEvent = specialEvents[event.action].call(this, fn);
						event.action = specialEvent.action;

						eventIndex = this.events[event.originalAction].push(event) - 1;

					};

					this.addEventListener(event.action, this.events[event.originalAction][eventIndex].fn, useCapture);

				};

			});

			return this;

		},
		off: function( actions, fn, useCapture ){

			actions = actions.split(/\s+/);

			if( isBoolean(fn) ){

				useCapture = fn;
				fn = null;

			};

			if( isEmpty(useCapture) ){

				useCapture = false;

			};

			this.each(function(){

				for( var action = 0, actionLength = actions.length; action < actionLength; action++ ){

					if( !isEmpty(this.events) && !isEmpty(this.events[actions[action]]) ){

						for( var eventIndex = 0, eventLength = this.events[actions[action]].length; eventIndex < eventLength; eventIndex++ ){

							if( isEmpty(fn) || fn === this.events[actions[action]][eventIndex].fn ){

								this.removeEventListener(this.events[actions[action]][eventIndex].action, this.events[actions[action]][eventIndex].fn, useCapture);
								this.events[actions[action]].splice(eventIndex, 1);
								eventIndex -= 1;
								eventLength -= 1;

							};

						};

					};

				};

			});

			return this;

		},
		trigger: function( actions ){

			actions = actions.split(/\s+/);

			this.each(function(){

				for( var action = 0, length = actions.length; action < length; action++ ){

					var specialEvent = null;

					if( specialEvents[actions[action]] ){

						specialEvent = specialEvents[actions[action]]();
						
					};

					if( !isEmpty(specialEvent) ){

						actions[action] = specialEvent.action;

					};

					var event = new Event("Event");
					event.initEvent(actions[action]);

					this.dispatchEvent(event);

				};

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

					returned.push(this.innerWidth || this.clientWidth);

				});

				return returned;

			}
			else {

				this.each(function(){

					if( isEmpty(this.width) ){

						this.style.width = width + (isNumber(width) ? "px" : "");

					}
					else {

						this.width = width;

					};

				});

			};

		},
		height: function( height ){

			if( isEmpty(height) ){

				var returned = new Array();

				this.each(function(){

					returned.push(this.innerHeight || this.clientHeight);

				});

				return returned;

			}
			else {

				this.each(function(){

					if( isEmpty(this.height) ){

						this.style.height = height + (isNumber(height) ? "px" : "");

					}
					else {

						this.height = height;

					};

				});

			};

		},
		css: function( property, value, unverify ){

			if( isString(property) ){

				if( !isEmpty(value) ){

					value = value.toString();

					this.each(function(){

						if( !isFalse(unverify) ){
 
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

							if( !isFalse(value) ){

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
			else if( isObject(property) ){

				this.each(function(){

					for( var parameter in property ){

						if( property.hasOwnProperty(parameter) ){

							if( !isFalse(value) ){

								parameter = prepareCSSProperty(parameter);

							};

							this.style[parameter] = property[parameter];

						};

					};

				});

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
			else if( isEmpty(property) ){

				var returned = new Array();

				this.each(function(){

					returned.push(window.getComputedStyle(this, null));

				});

				return returned;

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

			$this.selector = this.selector;
			$this.found = this.found;
			$this.length = found.length;
			$this.previous = Jo.clone(this.previous);

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

					this.textContent = text;

				});

				this.found = this.found;
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

			var returned = new Array();

			this.each(function(){

				if( isText(this) ){

					returned.push(this.textContent);

				}
				else {

					returned.push(this.outerHTML);

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

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.found = found;
			$this.length = this.found.length;
			$this.previous = previous;

			return $this;

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

					this.parentNode.insertBefore(html, this);

				});

			}
			else if( isNodeList(html) ){

				this.each(function(){

					for( var node = 0, length = html.length; node < length; node++ ){

						this.parentNode.insertBefore(html[node], this);

					};

				});

			}
			else if( isJo(html) ){

				this.each(function(){

					for( var node = 0, length = html.found.length; node < length; node++ ){

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

					this.insertAdjacentHTML("afterend", html);

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.parentNode.insertBefore(html, this.nextElementSibling);

				});

			}
			else if( isNodeList(html) ){

				this.each(function(){

					for( var node = 0, length = html.length; node < length; node++ ){

						this.parentNode.insertBefore(html[node], this.nextElementSibling);

					};

				});

			}
			else if( isJo(html) ){

				this.each(function(){

					for( var node = 0, length = html.found.length; node < length; node++ ){

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

					this.insertAdjacentHTML("afterbegin", html);

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.insertBefore(html, this.firstChild);

				});

			}
			else if( isNodeList(html) ){

				this.each(function(){

					for( var node = 0, length = html.length; node < length; node++ ){

						this.insertBefore(html[node], this.firstChild);

					};

				});

			}
			else if( isJo(html) ){

				this.each(function(){

					for( var node = 0, length = html.found.length; node < length; node++ ){

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

					this.insertAdjacentHTML("beforeend", html);

				});

			}
			else if( isNode(html) ){

				this.each(function(){

					this.appendChild(html);

				});

			}
			else if( isNodeList(html) ){

				this.each(function(){

					for( var node = 0, length = html.length; node < length; node++ ){

						this.appendChild(nodes[node]);

					};

				});

			}
			else if( isJo(html) ){

				this.each(function(){

					for( var node = 0, length = html.found.length; node < length; node++ ){

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
			var found = new Array();

			var $wrapper = Jo(html);

			this.each(function(){

				found.push(this);

				this.parentNode.insertBefore($wrapper.found[0], this);

				$wrapper.found[0].appendChild(this);

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		replace: function( html ){

			var $this = Jo(this);
			var found = new Array();

			this.each(function(){

				var $html = Jo(html);

				var position = this;

				$html.each(function(){

					position.parentNode.insertBefore(this, position.nextSibling);

					found.push(this);

					position = this;

				});

				this.remove();

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

		},
		remove: function(){

			var $this = Jo(this);

			var found = new Array();

			this.each(function(){

				this.remove();

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.found = new Array();
			$this.length = 0;
			$this.previous = previous;

			return this;

		},
		empty: function(){

			var $this = Jo(this);
			var found = new Array();

			this.each(function(){

				found.push(this);

				while( this && this.lastChild ){

					this.removeChild(this.lastChild);

				};

			});

			var previous = Jo.clone(this.previous);
			previous.unshift(this);

			$this.found = found;
			$this.length = found.length;
			$this.previous = previous;

			return $this;

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
				easing: "linear",
				additional: false
			}, options);

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

							if( isEmpty(alpha, true) ){

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
								to: parseFloat(alpha),
								difference: 0,
								unit: ""
							});

							return "rgba(#" + (redIndex - 1) + ", #" + (greenIndex - 1) + ", #" + (blueIndex - 1) + ", #" + (alphaIndex - 1) + ")";

						})
						.replace(/(#)?([0-9\.]+)/g, function( match, hash, number ){

							if( hash === "#" ){

								return match;

							};

							var index = valuesTo[property].values.push({
								from: null,
								to: parseFloat(number),
								difference: 0,
								unit: ""
							});

							return "#" + (index - 1);

						});

					var preparedProperty = prepareCSSProperty(property);

					if( preparedProperty !== property ){

						styles[preparedProperty] = styles[property];
						delete styles[property];

						valuesTo[preparedProperty] = valuesTo[property];
						delete valuesTo[property];

					};

				};

			};

			var currentStyles = this.css();

			var task = {
				this: this,
				elements: new Array(),
				options: options,
				each: function( fn ){

					for( var element = 0, length = this.elements.length; element < length; element++ ){

						fn.call(null, this.elements[element]);

					};

				}
			};

			this.each(function( index ){

				var element = {
					$element: Jo(this),
					properties: new Object()
				};

				for( var property in styles ){

					if( styles.hasOwnProperty(property) ){

						element.properties[property] = new Object();

						var uncamelizedProperty = uncamelize(property);

						var from = currentStyles[index].getPropertyValue(uncamelizedProperty);
						var model = valuesTo[property].model;
						var values = valuesTo[property].values;
						var isTransform = /^\s*(?:\-(?:webkit|moz|o|ms)?\-)?transform/i.test(property);

						var valueIndex = -1;
						if( from === "auto" && !isEmpty(this[camelize("offset-" + property)]) ){

							from = this[camelize("offset-" + property)] + "px";

						}
						else if( from === "none" ){

							if( isTrue(isTransform) ){

								from = Jo.matrix().toString();

							}
							else {

								from = "0";

							};

						}
						else if( from === "transparent" ){

							from = "rgba(0,0,0,0)";

						};

						if( isFalse(isTransform) ){

							from = from
								.replace(regularExpressions.length, function( match, number, unit ){

									valueIndex++;

									var convertedValue = convertCSSValue(this, property, number, unit, valuesTo[property].values[valueIndex].unit);

									values[valueIndex].from = convertedValue;
									values[valueIndex].difference = Math.abs(convertedValue - values[valueIndex].to) * (convertedValue > values[valueIndex].to ? -1 : 1);

									return "#" + valueIndex;

								}.bind(this))
								.replace(regularExpressions.RGBColor, function( match, red, green, blue, alpha ){

									if( isEmpty(alpha, true) ){

										alpha = 1;

									};

									var redValue = parseInt(red);
									values[++valueIndex].from = redValue;
									values[valueIndex].difference = Math.abs(redValue - values[valueIndex].to) * (redValue > values[valueIndex].to ? -1 : 1);

									var greenValue = parseInt(green);
									values[++valueIndex].from = greenValue;
									values[valueIndex].difference = Math.abs(greenValue - values[valueIndex].to) * (greenValue > values[valueIndex].to ? -1 : 1);

									var blue = parseInt(blue);
									values[++valueIndex].from = blue;
									values[valueIndex].difference = Math.abs(blue - values[valueIndex].to) * (blue > values[valueIndex].to ? -1 : 1);

									var alphaValue = parseFloat(alpha);
									values[++valueIndex].from = alphaValue;
									values[valueIndex].difference = Math.abs(alphaValue - values[valueIndex].to) * (alphaValue > values[valueIndex].to ? -1 : 1);

									return "#" + (valueIndex - 1);

								})
								.replace(/(#)?([0-9\.]+)/g, function( match, hash, number ){

									if( hash === "#" ){

										return match;

									};

									valueIndex++;

									var convertedValue = parseFloat(number);

									values[valueIndex].from = convertedValue;
									values[valueIndex].difference = Math.abs(convertedValue - values[valueIndex].to) * (convertedValue > values[valueIndex].to ? -1 : 1);

									return "#" + (valueIndex - 1);

								});

						}
						else {

							var fromMatrix = element.properties[property].origin = Jo.matrix(from);

							if( isFalse(options.additional) ){

								valuesTo[property].model.replace(/([a-z]+)\(([^\)]+)\)/gi, function( match, name, ids ){

									ids = ids.replace(/#/g, "").split(",");

									var matrixValues = null;

									if( /^scale/.test(name) ){

										matrixValues = fromMatrix.getScale();

									}
									else if( /^translate/.test(name) ){

										matrixValues = fromMatrix.getTranslate();

									}
									else if( /^skew/.test(name) ){

										matrixValues = fromMatrix.getSkew();

									}
									else if( /^rotate/.test(name) ){

										matrixValues = fromMatrix.getRotate();

									};

									var matrixValue = null;

									for( var id = 0, length = ids.length; id < length; id++ ){

										valueIndex = parseInt(ids[id]);

										if( /^(?:scale|translate|skew|rotate)X/i.test(name) ){

											matrixValue = matrixValues.x;

										}
										else if( /^(?:scale|translate|skew|rotate)Y/i.test(name) ){

											matrixValue = matrixValues.y;

										}
										else if( /^(?:scale|translate|rotate)Z/i.test(name) ){

											matrixValue = matrixValues.z;

										}
										else if( id === 0 ){

											matrixValue = matrixValues.x;

										}
										else if( id === 1 ){

											matrixValue = matrixValues.y;

										}
										else if( id === 2 ){

											matrixValue = matrixValues.z;

										};

										values[valueIndex].from = matrixValue;
										values[valueIndex].difference = Math.abs(matrixValue - values[valueIndex].to) * (matrixValue > values[valueIndex].to ? -1 : 1);

									};

									return "";

								});

							}
							else {

								for( var transformation = 0, length = values.length; transformation < length; transformation++ ){

									valueIndex++;

									values[valueIndex].from = 0;
									values[valueIndex].difference = values[valueIndex].to;

								};

							};

						};

						element.properties[property].model = valuesTo[property].model;
						element.properties[property].values = valuesTo[property].values;

					};

				};

				task.elements.push(element);

			});

			Animations.add(task);

			return this;

		}
	};

	Jo.fn.init.prototype = Jo.fn;

	Jo.merge = function( returned ){

		if( !isEmpty(returned) && isEmpty(arguments[1]) ){

			var type = isArray(returned) ? new Array() : new Object();

			return Jo.merge(type, returned);

		}
		else if( isEmpty(returned) && !isEmpty(arguments[1]) ){

			returned = isArray(arguments[1]) ? new Array() : new Object();

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

	Jo.clone = function( returned ){

		return Jo.merge(returned);

	};

	Jo.extend = function( returned ){

		if( !isEmpty(returned) && isEmpty(arguments[1]) ){

			var type = isArray(returned) ? new Array() : new Object();

			return Jo.extend(type, returned);

		}
		else if( isEmpty(returned) && !isEmpty(arguments[1]) ){

			returned = isArray(arguments[1]) ? new Array() : new Object();

		};

		for( var argument = 1, length = arguments.length; argument < length; argument++ ){

			for( var key in arguments[argument] ){

				if( isEmpty(returned[key]) ){

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

		};

		return returned;

	};

	Jo.animation = function( options ){

		return new Jo.animation.fn.init(options);

	};

	Jo.animation.fn = Jo.animation.prototype = {
		constructor: Jo.animation,
		init: function( options ){

			options = Jo.merge({
				start: false,
				fps: 30,
				fn: null
			}, options);

			this.active = options.start;
			this.fps = options.fps;
			this.interval = 1000 / this.fps;
			this.now = 0;
			this.then = 0;
			this.deltaTime = 0;

			this.fn = options.fn;
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

			this.animationFrame = window.requestAnimationFrame(this.loop.bind(this));

			if( this.active === false ){

				return window.cancelAnimationFrame(this.animationFrame);

			};

			this.now = now;
			this.deltaTime = this.now - this.then;

			if( this.deltaTime > this.interval ){

				this.fn(now);

				this.then = now - (this.deltaTime % this.interval);

			};

			return this;

		},
		each: function( fn ){

			for( var task = 0; task < this.tasks.length; task++ ){

				fn.call(this, this.tasks[task], task);

			};

			return this;

		},
		add: function( task ){

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

	var Animations = Jo.animation({
		fps: 30,
		fn: function( now ){

			this.each(function( task, index ){

				if( isEmpty(task.options.start) ){

					task.options.start = now;

				};

				var elapsedTime = now - task.options.start;

				if( elapsedTime >= task.options.duration ){

					elapsedTime = task.options.duration;

				};

				task.each(function( element ){

					var step = new Object();

					for( var property in element.properties ){

						if( element.properties.hasOwnProperty(property) ){

							var currentProperty = element.properties[property];
							var model = currentProperty.model;
							var easing = Jo.easing(task.options.easing, elapsedTime, task.options.duration);
							var isTransform = (property === "transform") ? true : false;


							for( var value = 0, length = currentProperty.values.length; value < length; value++ ){

								var newValue = currentProperty.values[value].from + easing * currentProperty.values[value].difference;

								if( isTrue(currentProperty.values[value].integer) ){

									newValue = parseInt(newValue);

								};

								model = model.replace("#" + value, newValue + element.properties[property].values[value].unit);

							};

							if( isTrue(isTransform) ){

								model = currentProperty.origin.add(model).toString();

							};

							step[property] = model;

							element.$element.css(property, model, false);

						};

					};

					if( isFunction(task.options.onStep) ){

						task.options.onStep.call(element.$element, step);

					};

				});

				if( elapsedTime === task.options.duration ){

					if( isFunction(task.options.onComplete) ){

						task.options.onComplete.call(task.this);

					};

					this.remove(index);

				};

			});

		}
	});

	window.CSSMatrix = (window.WebKitCSSMatrix || window.CSSMatrix);

	Jo.matrix = function( matrix ){

		return new Jo.matrix.fn.init(matrix);

	};

	Jo.matrix.fn = Jo.matrix.prototype = {
		constructor: Jo.matrix,
		init: function( matrix ){

			this.map = {
				a: "m11",
				b: "m12",
				c: "m21",
				d: "m22",
				e: "m41",
				f: "m42",
				m11: "a",
				m12: "b",
				m13: "m13",
				m14: "m14",
				m21: "c",
				m22: "d",
				m23: "m23",
				m24: "m24",
				m31: "m31",
				m32: "m32",
				m33: "m33",
				m34: "m34",
				m41: "e",
				m42: "f",
				m43: "m43",
				m44: "m44"
			};

			if( !isEmpty(window.CSSMatrix) ){

				if( !isEmpty(matrix, true) ){

					matrix = matrix.replace(/[0-9]+\.?[0-9]+e[+-][0-9]+/g, function( match ){

						return parseFloat(match).toFixed(20);

					});

				};

				this.matrix = new window.CSSMatrix(matrix || "");

			}
			else {

				if( isEmpty(matrix) ){

					this.matrix = this.getIdentity();

				}
				else if( matrix.constructor === Jo.matrix ){

					this.matrix = this.clone(matrix).matrix;

				}
				else if( isObject(matrix) ){

					this.matrix = Jo.clone(matrix);

				}
				else if( isString(matrix) ){

					this.matrix = this.add(matrix).matrix;

				};

			};

			return this;

		},
		get: function( name ){

			return this.matrix[this.map[name]];

		},
		set: function( name, number ){

			var clone = this.clone();

			clone.matrix[this.map[name]] = number;
			clone.matrix[name] = number;

			return clone;

		},
		getScale: function(){

			return {
				x: Math.sqrt(this.get("m11") * this.get("m11") + this.get("m21") * this.get("m21")),
				y: Math.sqrt(this.get("m12") * this.get("m12") + this.get("m22") * this.get("m22")),
				z: Math.sqrt(this.get("m13") * this.get("m13") + this.get("m23") * this.get("m23"))
			};

		},
		scale: function( x, y, z ){

			var clone = this.clone();

			if( !isEmpty(window.CSSMatrix) ){

				clone.matrix = clone.matrix.scale(x, y, z);

			}
			else {

				if( !isEmpty(x) ){

					clone = clone
						.set("m11", clone.get("m11") * x)
						.set("m12", clone.get("m12") * x)
						.set("m13", clone.get("m13") * x)
						.set("m14", clone.get("m14") * x);

				};

				if( !isEmpty(y) ){

					clone = clone
						.set("m21", clone.get("m21") * y)
						.set("m22", clone.get("m22") * y)
						.set("m23", clone.get("m23") * y)
						.set("m24", clone.get("m24") * y);

				};

				if( !isEmpty(z) ){

					clone = clone
						.set("m31", clone.get("m31") * z)
						.set("m32", clone.get("m32") * z)
						.set("m33", clone.get("m33") * z)
						.set("m34", clone.get("m34") * z);

				};
				
			};

			return clone;

		},
		scaleX: function( unit ){

			return this.scale(unit, null, null);

		},
		scaleY: function( unit ){

			return this.scale(null, unit, null);

		},
		scaleZ: function( unit ){

			return this.scale(null, null, unit);

		},
		getTranslate: function(){

			return {
				x: this.get("m41"),
				y: this.get("m42"),
				z: this.get("m43")
			};

		},
		translate: function( x, y, z ){

			var clone = this.clone();

			if( !isEmpty(window.CSSMatrix) ){

				clone.matrix = clone.matrix.translate(x, y, z);

			}
			else {

				clone = clone
					.set("m41", clone.get("m11") * x + clone.get("m21") * y + clone.get("m31") * z + clone.get("m41"))
					.set("m42", clone.get("m12") * x + clone.get("m22") * y + clone.get("m32") * z + clone.get("m42"))
					.set("m43", clone.get("m13") * x + clone.get("m14") * y + clone.get("m33") * z + clone.get("m43"))
					.set("m44", clone.get("m14") * x + clone.get("m24") * y + clone.get("m34") * z + clone.get("m44"));

			};

			return clone;

		},
		translateX: function( pixels ){

			return this.translate(pixels, null, null);

		},

		translateY: function( pixels ){

			return this.translate(null, pixels, null);

		},

		translateZ: function( pixels ){

			return this.translate(null, null, pixels);

		},
		getSkew: function(){

			return {
				x: ((Math.atan2(this.get("d"), this.get("c")) * (180 / Math.PI)) - 90) * -1,
				y: Math.atan2(this.get("b"), this.get("a")) * (180 / Math.PI)
			};

		},
		skew: function( x, y ){

			var identity = Jo.matrix();

			if( !isEmpty(window.CSSMatrix) ){

				identity.matrix = identity.matrix.skew(x, y);

			}
			else {

				identity = identity
					.set("m23", Math.tan(x * Math.PI / 180))
					.set("m12", Math.tan(y * Math.PI / 180));

			};

			return identity.multiply(this);

		},
		skewX: function( degrees ){

			return this.skew(degrees, null);

		},
		skewY: function( degrees ){

			return this.skew(null, degrees);

		},
		getRotate: function(){

			var rotationX = Math.atan2(this.get("m23"), this.get("m33"));
			var rotationY = Math.asin(-this.get("m13"));
			var rotationZ = Math.atan2(this.get("m12"), this.get("m11"));

			if( Math.cos(rotationY) === 0 ){

				rotationX = Math.atan2(-this.get("m31"), this.get("m22"));
				rotationZ = 0;

			};

			return {
				x: rotationX * 180 / Math.PI,
				y: rotationY * 180 / Math.PI,
				z: rotationZ * 180 / Math.PI,
			};

		},
		rotate: function( x, y, z ){

			var clone = this.clone();

			if( !isEmpty(window.CSSMatrix) ){

				clone.matrix = clone.matrix.rotate(x, y, z);

			}
			else {

				if( !isEmpty(x) ){

					var radians = -x * (Math.PI / 180);
					var cosine = Math.cos(radians);
					var sine = Math.sin(radians);
					var clone = this.clone();

					clone = clone
						.set("m12", cosine * this.get("m12") + sine * this.get("m13"))
						.set("m22", cosine * this.get("m22") + sine * this.get("m23"))
						.set("m32", cosine * this.get("m32") + sine * this.get("m33"))
						.set("m42", cosine * this.get("m42") + sine * this.get("m43"))

						.set("m13", cosine * this.get("m13") - sine * this.get("m12"))
						.set("m23", cosine * this.get("m23") - sine * this.get("m22"))
						.set("m33", cosine * this.get("m33") - sine * this.get("m32"))
						.set("m43", cosine * this.get("m43") - sine * this.get("m42"));

				};

				if( !isEmpty(y) ){

					var radians = -y * (Math.PI / 180);
					var cosine = Math.cos(radians);
					var sine = Math.sin(radians);
					var clone = this.clone();

					clone = clone
						.set("m11", cosine * this.get("m11") - sine * this.get("m13"))
						.set("m21", cosine * this.get("m21") - sine * this.get("m23"))
						.set("m31", cosine * this.get("m31") - sine * this.get("m33"))
						.set("m41", cosine * this.get("m41") - sine * this.get("m43"))

						.set("m13", cosine * this.get("m13") + sine * this.get("m11"))
						.set("m23", cosine * this.get("m23") + sine * this.get("m21"))
						.set("m33", cosine * this.get("m33") + sine * this.get("m31"))
						.set("m43", cosine * this.get("m43") + sine * this.get("m41"));

				};

				if( !isEmpty(z) ){

					var radians = -z * (Math.PI / 180);
					var cosine = Math.cos(radians);
					var sine = Math.sin(radians);
					var clone = this.clone();

					clone = clone
						.set("m11", cosine * this.get("m11") + sine * this.get("m12"))
						.set("m21", cosine * this.get("m21") + sine * this.get("m22"))
						.set("m31", cosine * this.get("m31") + sine * this.get("m32"))
						.set("m41", cosine * this.get("m41") + sine * this.get("m42"))

						.set("m12", cosine * this.get("m12") - sine * this.get("m11"))
						.set("m22", cosine * this.get("m22") - sine * this.get("m21"))
						.set("m32", cosine * this.get("m32") - sine * this.get("m31"))
						.set("m42", cosine * this.get("m42") - sine * this.get("m41"));

				};

			};

			return clone;

		},
		rotateX: function( degrees ){

			return this.rotate(degrees, null, null);

		},
		rotateY: function( degrees ){

			return this.rotate(null, degrees, null);

		},
		rotateZ: function( degrees ){

			return this.rotate(null, null, degrees);

		},
		rotate3d: function( x, y, z, degrees ){

			return this
				.rotateX((x < 0) ? -degrees : degrees)
				.rotateY((y < 0) ? -degrees : degrees)
				.rotateZ((z < 0) ? -degrees : degrees);

		},
		add: function( matrix ){

			var clone = this.clone();

			if( !isEmpty(matrix) ){

				if( !isString(matrix) ){

					matrix = Jo(matrix).toString();

				};
				
				if( !isEmpty(window.CSSMatrix) ){

					clone = clone.matrix.multiply(new window.CSSMatrix(matrix));

				}
				else if( isString(matrix) ){

					var transforms = matrix.match(/((scale|scaleX|scaleY|scaleZ|scale3d|rotate|rotateX|rotateY|rotateZ|rotate3d|translate|translateX|translateY|translateZ|translate3d|matrix|matrix3d)\([^\)]*\))/g);

					for( var transform = 0, length = transforms.length; transform < length; transform++ ){

						var values = transforms[transform].replace(/3d/, "").match(/[\-]?\s*\d+(?:\.\d+)?/g);

						var identity = Jo.matrix();

						if( /^scale\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.scaleX(parseFloat(values[0]));

								if( !isEmpty(values[1]) ){

									identity = identity.scaleX(parseFloat(values[1]));

								}
								else {

									identity = identity.scaleY(parseFloat(values[0]));

								};

							};

						}
						else if( /^scaleX\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.scaleX(parseFloat(values[0]));

							};

						}
						else if( /^scaleY\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.scaleY(parseFloat(values[0]));

							};

						}
						else if( /^scaleZ\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.scaleX(parseFloat(values[0]));

							};

						}
						else if( /^translate\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.translateX(parseFloat(values[0]));

							};

							if( !isEmpty(values[1]) ){

								identity = identity.translateY(parseFloat(values[1]));

							};

						}
						else if( /^translateX\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.translateX(parseFloat(values[0]));

							};

						}
						else if( /^translateY\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.translateY(parseFloat(values[0]));

							};

						}
						else if( /^translateZ\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.translateZ(parseFloat(values[0]));

							};

						}
						else if( /^translate3d\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) && !isEmpty(values[1]) && !isEmpty(values[2]) ){

								identity = identity.translate(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]));

							};

						}
						else if( /^skew\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.skewX(parseFloat(values[0]));

							};

							if( !isEmpty(values[1]) ){

								identity = identity.skewY(parseFloat(values[1]));

							};

						}
						else if( /^skewX\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.skewX(parseFloat(values[0]));

							};

						}
						else if( /^skewY\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.skewY(parseFloat(values[0]));

							};

						}
						else if( /^rotate(\(|\Z\()/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.rotateZ(parseFloat(values[0]));

							};

						}
						else if( /^rotateX\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.rotateX(parseFloat(values[0]));

							};

						}
						else if( /^rotateY\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) ){

								identity = identity.rotateY(parseFloat(values[0]));

							};

						}
						else if( /^rotate3d\(/.test(transforms[transform]) ){

							if( !isEmpty(values[0]) && !isEmpty(values[1]) && !isEmpty(values[2]) && !isEmpty(values[3]) ){

								identity = identity.rotate3d(parseFloat(values[0]), parseFloat(values[1]), parseFloat(values[2]), parseFloat(values[3]));

							};

						}
						else if( /^matrix/.test(transforms[transform]) ){

							if( values.length === 6 ){

								identity = identity
									.set("m11", parseFloat(values[0]))
									.set("m12", parseFloat(values[1]))
									.set("m13", 0)
									.set("m14", 0)
									.set("m21", parseFloat(values[2]))
									.set("m22", parseFloat(values[3]))
									.set("m23", 0)
									.set("m24", 0)
									.set("m31", 0)
									.set("m32", 0)
									.set("m33", 1)
									.set("m34", 0)
									.set("m41", parseFloat(values[4]))
									.set("m42", parseFloat(values[5]))
									.set("m43", 0)
									.set("m44", 1)

							}
							else if( values.length === 16 ){

								identity = identity
									.set("m11", parseFloat(values[0]))
									.set("m12", parseFloat(values[1]))
									.set("m13", parseFloat(values[2]))
									.set("m14", parseFloat(values[3]))
									.set("m21", parseFloat(values[4]))
									.set("m22", parseFloat(values[5]))
									.set("m23", parseFloat(values[6]))
									.set("m24", parseFloat(values[7]))
									.set("m31", parseFloat(values[8]))
									.set("m32", parseFloat(values[9]))
									.set("m33", parseFloat(values[10]))
									.set("m34", parseFloat(values[11]))
									.set("m41", parseFloat(values[12]))
									.set("m42", parseFloat(values[13]))
									.set("m43", parseFloat(values[14]))
									.set("m44", parseFloat(values[15]));

							};

						};

						clone = clone.multiply(identity);

					};

				};

			};

			return clone;

		},
		inverse: function(){

			var clone = this.clone();

			if( !isEmpty(window.CSSMatrix) ){

				clone.matrix = clone.matrix.inverse();

			}
			else {

				clone
					.set("m11", clone.get("m23") * clone.get("m34") * clone.get("m42") - clone.get("m24") * clone.get("m33") * clone.get("m42") + clone.get("m24") * clone.get("m32") * clone.get("m43") - clone.get("m22") * clone.get("m34") * clone.get("m43") - clone.get("m23") * clone.get("m32") * clone.get("m44") + clone.get("m22") * clone.get("m33") * clone.get("m44"))
					.set("m12", clone.get("m14") * clone.get("m33") * clone.get("m42") - clone.get("m13") * clone.get("m34") * clone.get("m42") - clone.get("m14") * clone.get("m32") * clone.get("m43") + clone.get("m12") * clone.get("m34") * clone.get("m43") + clone.get("m13") * clone.get("m32") * clone.get("m44") - clone.get("m12") * clone.get("m33") * clone.get("m44"))
					.set("m13", clone.get("m13") * clone.get("m24") * clone.get("m42") - clone.get("m14") * clone.get("m23") * clone.get("m42") + clone.get("m14") * clone.get("m22") * clone.get("m43") - clone.get("m12") * clone.get("m24") * clone.get("m43") - clone.get("m13") * clone.get("m22") * clone.get("m44") + clone.get("m12") * clone.get("m23") * clone.get("m44"))
					.set("m14", clone.get("m14") * clone.get("m23") * clone.get("m32") - clone.get("m13") * clone.get("m24") * clone.get("m32") - clone.get("m14") * clone.get("m22") * clone.get("m33") + clone.get("m12") * clone.get("m24") * clone.get("m33") + clone.get("m13") * clone.get("m22") * clone.get("m34") - clone.get("m12") * clone.get("m23") * clone.get("m34"))
					.set("m21", clone.get("m24") * clone.get("m33") * clone.get("m41") - clone.get("m23") * clone.get("m34") * clone.get("m41") - clone.get("m24") * clone.get("m31") * clone.get("m43") + clone.get("m21") * clone.get("m34") * clone.get("m43") + clone.get("m23") * clone.get("m31") * clone.get("m44") - clone.get("m21") * clone.get("m33") * clone.get("m44"))
					.set("m22", clone.get("m13") * clone.get("m34") * clone.get("m41") - clone.get("m14") * clone.get("m33") * clone.get("m41") + clone.get("m14") * clone.get("m31") * clone.get("m43") - clone.get("m11") * clone.get("m34") * clone.get("m43") - clone.get("m13") * clone.get("m31") * clone.get("m44") + clone.get("m11") * clone.get("m33") * clone.get("m44"))
					.set("m23", clone.get("m14") * clone.get("m23") * clone.get("m41") - clone.get("m13") * clone.get("m24") * clone.get("m41") - clone.get("m14") * clone.get("m21") * clone.get("m43") + clone.get("m11") * clone.get("m24") * clone.get("m43") + clone.get("m13") * clone.get("m21") * clone.get("m44") - clone.get("m11") * clone.get("m23") * clone.get("m44"))
					.set("m24", clone.get("m13") * clone.get("m24") * clone.get("m31") - clone.get("m14") * clone.get("m23") * clone.get("m31") + clone.get("m14") * clone.get("m21") * clone.get("m33") - clone.get("m11") * clone.get("m24") * clone.get("m33") - clone.get("m13") * clone.get("m21") * clone.get("m34") + clone.get("m11") * clone.get("m23") * clone.get("m34"))
					.set("m31", clone.get("m22") * clone.get("m34") * clone.get("m41") - clone.get("m24") * clone.get("m32") * clone.get("m41") + clone.get("m24") * clone.get("m31") * clone.get("m42") - clone.get("m21") * clone.get("m34") * clone.get("m42") - clone.get("m22") * clone.get("m31") * clone.get("m44") + clone.get("m21") * clone.get("m32") * clone.get("m44"))
					.set("m32", clone.get("m14") * clone.get("m32") * clone.get("m41") - clone.get("m12") * clone.get("m34") * clone.get("m41") - clone.get("m14") * clone.get("m31") * clone.get("m42") + clone.get("m11") * clone.get("m34") * clone.get("m42") + clone.get("m12") * clone.get("m31") * clone.get("m44") - clone.get("m11") * clone.get("m32") * clone.get("m44"))
					.set("m33", clone.get("m12") * clone.get("m24") * clone.get("m41") - clone.get("m14") * clone.get("m22") * clone.get("m41") + clone.get("m14") * clone.get("m21") * clone.get("m42") - clone.get("m11") * clone.get("m24") * clone.get("m42") - clone.get("m12") * clone.get("m21") * clone.get("m44") + clone.get("m11") * clone.get("m22") * clone.get("m44"))
					.set("m34", clone.get("m14") * clone.get("m22") * clone.get("m31") - clone.get("m12") * clone.get("m24") * clone.get("m31") - clone.get("m14") * clone.get("m21") * clone.get("m32") + clone.get("m11") * clone.get("m24") * clone.get("m32") + clone.get("m12") * clone.get("m21") * clone.get("m34") - clone.get("m11") * clone.get("m22") * clone.get("m34"))
					.set("m41", clone.get("m23") * clone.get("m32") * clone.get("m41") - clone.get("m22") * clone.get("m33") * clone.get("m41") - clone.get("m23") * clone.get("m31") * clone.get("m42") + clone.get("m21") * clone.get("m33") * clone.get("m42") + clone.get("m22") * clone.get("m31") * clone.get("m43") - clone.get("m21") * clone.get("m32") * clone.get("m43"))
					.set("m42", clone.get("m12") * clone.get("m33") * clone.get("m41") - clone.get("m13") * clone.get("m32") * clone.get("m41") + clone.get("m13") * clone.get("m31") * clone.get("m42") - clone.get("m11") * clone.get("m33") * clone.get("m42") - clone.get("m12") * clone.get("m31") * clone.get("m43") + clone.get("m11") * clone.get("m32") * clone.get("m43"))
					.set("m43", clone.get("m13") * clone.get("m22") * clone.get("m41") - clone.get("m12") * clone.get("m23") * clone.get("m41") - clone.get("m13") * clone.get("m21") * clone.get("m42") + clone.get("m11") * clone.get("m23") * clone.get("m42") + clone.get("m12") * clone.get("m21") * clone.get("m43") - clone.get("m11") * clone.get("m22") * clone.get("m43"))
					.set("m44", clone.get("m12") * clone.get("m23") * clone.get("m31") - clone.get("m13") * clone.get("m22") * clone.get("m31") + clone.get("m13") * clone.get("m21") * clone.get("m32") - clone.get("m11") * clone.get("m23") * clone.get("m32") - clone.get("m12") * clone.get("m21") * clone.get("m33") + clone.get("m11") * clone.get("m22") * clone.get("m33"));

			};

			return clone.scale(1 / clone.getDeterminant());

		},
		multiply: function( matrix ){

			var clone = this.clone();

			if( !isEmpty(window.CSSMatrix) ){

				clone.matrix = clone.matrix.multiply(matrix);

			}
			else {

				matrix = matrix.clone();

				matrix = matrix
					.set("m11", matrix.get("m11") * clone.get("m11") + matrix.get("m12") * clone.get("m21") + matrix.get("m13") * clone.get("m31") + matrix.get("m14") * clone.get("m41"))
					.set("m12", matrix.get("m11") * clone.get("m12") + matrix.get("m12") * clone.get("m22") + matrix.get("m13") * clone.get("m32") + matrix.get("m14") * clone.get("m42"))
					.set("m13", matrix.get("m11") * clone.get("m13") + matrix.get("m12") * clone.get("m23") + matrix.get("m13") * clone.get("m33") + matrix.get("m14") * clone.get("m43"))
					.set("m14", matrix.get("m11") * clone.get("m14") + matrix.get("m12") * clone.get("m24") + matrix.get("m13") * clone.get("m34") + matrix.get("m14") * clone.get("m44"))
					.set("m21", matrix.get("m21") * clone.get("m11") + matrix.get("m22") * clone.get("m21") + matrix.get("m23") * clone.get("m31") + matrix.get("m24") * clone.get("m41"))
					.set("m22", matrix.get("m21") * clone.get("m12") + matrix.get("m22") * clone.get("m22") + matrix.get("m23") * clone.get("m32") + matrix.get("m24") * clone.get("m42"))
					.set("m23", matrix.get("m21") * clone.get("m13") + matrix.get("m22") * clone.get("m23") + matrix.get("m23") * clone.get("m33") + matrix.get("m24") * clone.get("m43"))
					.set("m24", matrix.get("m21") * clone.get("m14") + matrix.get("m22") * clone.get("m24") + matrix.get("m23") * clone.get("m34") + matrix.get("m24") * clone.get("m44"))
					.set("m31", matrix.get("m31") * clone.get("m11") + matrix.get("m32") * clone.get("m21") + matrix.get("m33") * clone.get("m31") + matrix.get("m34") * clone.get("m41"))
					.set("m32", matrix.get("m31") * clone.get("m12") + matrix.get("m32") * clone.get("m22") + matrix.get("m33") * clone.get("m32") + matrix.get("m34") * clone.get("m42"))
					.set("m33", matrix.get("m31") * clone.get("m13") + matrix.get("m32") * clone.get("m23") + matrix.get("m33") * clone.get("m33") + matrix.get("m34") * clone.get("m43"))
					.set("m34", matrix.get("m31") * clone.get("m14") + matrix.get("m32") * clone.get("m24") + matrix.get("m33") * clone.get("m34") + matrix.get("m34") * clone.get("m44"))
					.set("m41", matrix.get("m41") * clone.get("m11") + matrix.get("m42") * clone.get("m21") + matrix.get("m43") * clone.get("m31") + matrix.get("m44") * clone.get("m41"))
					.set("m42", matrix.get("m41") * clone.get("m12") + matrix.get("m42") * clone.get("m22") + matrix.get("m43") * clone.get("m32") + matrix.get("m44") * clone.get("m42"))
					.set("m43", matrix.get("m41") * clone.get("m13") + matrix.get("m42") * clone.get("m23") + matrix.get("m43") * clone.get("m33") + matrix.get("m44") * clone.get("m43"))
					.set("m44", matrix.get("m41") * clone.get("m14") + matrix.get("m42") * clone.get("m24") + matrix.get("m43") * clone.get("m34") + matrix.get("m44") * clone.get("m44"));

			};

			return matrix;

		},
		getDeterminant: function(){

			return (
				this.get("m41") * (
					+ this.get("m14") * this.get("m23") * this.get("m32")
					- this.get("m13") * this.get("m24") * this.get("m32")
					- this.get("m14") * this.get("m22") * this.get("m33")
					+ this.get("m12") * this.get("m24") * this.get("m33")
					+ this.get("m13") * this.get("m22") * this.get("m34")
					- this.get("m12") * this.get("m23") * this.get("m34")
				)
				+ this.get("m42") * (
					+ this.get("m11") * this.get("m23") * this.get("m34")
					- this.get("m11") * this.get("m24") * this.get("m33")
					+ this.get("m14") * this.get("m21") * this.get("m33")
					- this.get("m13") * this.get("m21") * this.get("m34")
					+ this.get("m13") * this.get("m24") * this.get("m31")
					- this.get("m14") * this.get("m23") * this.get("m31")
				)
				+ this.get("m43") * (
					+ this.get("m11") * this.get("m24") * this.get("m32")
					- this.get("m11") * this.get("m22") * this.get("m34")
					- this.get("m14") * this.get("m21") * this.get("m32")
					+ this.get("m12") * this.get("m21") * this.get("m34")
					+ this.get("m14") * this.get("m22") * this.get("m31")
					- this.get("m12") * this.get("m24") * this.get("m31")
				)
				+ this.get("m44") * (
					- this.get("m13") * this.get("m22") * this.get("m31")
					- this.get("m11") * this.get("m23") * this.get("m32")
					+ this.get("m11") * this.get("m22") * this.get("m33")
					+ this.get("m13") * this.get("m21") * this.get("m32")
					- this.get("m12") * this.get("m21") * this.get("m33")
					+ this.get("m12") * this.get("m23") * this.get("m31")
				)
			);

		},
		getIdentity: function(){

			return {
				a: 1, b: 0, c: 0, d: 1, e: 0, f: 0,
				m11: 1, m12: 0, m13: 0, m14: 0,
				m21: 0, m22: 1, m23: 0, m24: 0,
				m31: 0, m32: 0, m33: 1, m34: 0,
				m41: 0, m42: 0, m43: 0, m44: 1
			};

		},
		clone: function(){

			var identity = Jo.matrix();

			for( var m in this.matrix ){

				if( this.matrix.hasOwnProperty(m) ){

					identity.matrix[m] = this.matrix[m];

				};

			};

			return identity;

		},
		toString: function(){

			return "matrix3d(" + this.get("m11").toFixed(6) + "," + this.get("m12").toFixed(6) + "," + this.get("m13").toFixed(6) + "," + this.get("m14").toFixed(6) + "," + this.get("m21").toFixed(6) + "," + this.get("m22").toFixed(6) + "," + this.get("m23").toFixed(6) + "," + this.get("m24").toFixed(6) + "," + this.get("m31").toFixed(6) + "," + this.get("m32").toFixed(6) + "," + this.get("m33").toFixed(6) + "," + this.get("m34").toFixed(6) + "," + this.get("m41").toFixed(6) + "," + this.get("m42").toFixed(6) + "," + this.get("m43").toFixed(6) + "," + this.get("m44").toFixed(6) + ")";

		},
		toHumanString: function(){

			var scale = this.getScale();
			var translate = this.getTranslate();
			var skew = this.getSkew();
			var rotate = this.getRotate();

			return "scaleX(" + scale.x.toFixed(6) + ") scaleY(" + scale.y.toFixed(6) + ") scaleZ(" + scale.z.toFixed(6) + ") translateX(" + translate.x.toFixed(6) + "px) translateY(" + translate.y.toFixed(6) + "px) translateZ(" + translate.z.toFixed(6) + "px) skewX(" + skew.x.toFixed(6) + "deg) skewY(" + skew.y.toFixed(6) + "deg) rotateX(" + rotate.x.toFixed(6) + "deg) rotateY(" + rotate.y.toFixed(6) + "deg) rotateZ(" + rotate.z.toFixed(6) + "deg)";

		}
	};

	Jo.matrix.fn.init.prototype = Jo.matrix.fn;

	Jo.object = function(){

	};

	Jo.object.fn = Jo.object.prototype = {
		constructor: Jo.object,
		init: function(){

			// TODO : stronger workflow to add, remove, update an object, with events, callback, etc...

			return this;

		},
		on: function(){

		},
		off: function(){

		}
	};

	Jo.object.fn.prototype = Jo.object.fn;

	Jo.worker = function( settings ){

		return new Jo.worker.fn.init(settings);

	};

	Jo.worker.fn = Jo.worker.prototype = {
		constructor: Jo.worker,
		init: function( settings ){

			settings = Jo.merge({
				console: true,
				parameters: new Array()
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

	Jo.stream = function(){

		return Jo.stream.fn.init();

	};

	Jo.stream.fn = Jo.stream.prototype = {
		constructor: Jo.stream,
		init: function(){

			// TODO, see http://www.html5rocks.com/en/tutorials/eventsource/basics/
			return this;

		}
	};

	Jo.stream.fn.init.prototype = Jo.stream.fn;

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

	navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

	Jo.media = function( settings ){

		return new Jo.media.fn.init(settings);

	};

	Jo.media.fn = Jo.media.prototype = {
		constructor: Jo.media,
		init: function( settings ){

			settings = Jo.merge({
				video: true,
				audio: true,
				success: function(){},
				error: function(){}
			}, settings);

			var media = navigator.getUserMedia({
				video: settings.video,
				audio: settings.audio
			}, function( stream ){

				this.stream = stream;

				this.src = window.URL.createObjectURL(this.stream);

				settings.success.call(this, this.src, this.stream);

			}.bind(this), function( code ){

				settings.error.call(this);

			}.bind(this));

			return this;

		},
		stop: function(){

			var videoTracks = this.stream.getVideoTracks();

			for( var track = 0, length = videoTracks.length; track < length; track++ ){

				videoTracks[track].stop();

			};

			return this;

		}
	};

	Jo.media.fn.init.prototype = Jo.media.fn;

	var RTCSessionDescription = (window.mozRTCSessionDescription || window.RTCSessionDescription);
	var RTCPeerConnection = (window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.RTCPeerConnection);
	var RTCIceCandidate = (window.mozRTCIceCandidate || window.RTCIceCandidate);

	Jo.peer = function( settings ){

		return new Jo.peer.fn.init( settings );

	};

	Jo.peer.fn = Jo.peer.prototype = {
		constructor: Jo.peer,
		init: function( settings ){

			settings = Jo.merge({
				config: {
					iceServers: new Array(),
					optional: [
						{
							RtpDataChannel: true
						}
					]
				},
				constraints: {
					mandatory: {
						OfferToReceiveVideo: true,
						OfferToReceiveAudio: true
					}
				},
				error: function( message ){

					console.error(message)

				}
			}, settings);

			this.channels = new Object();

			this.reset(settings);

			this.peer.createOffer(function( description ){

				this.peer.setLocalDescription(description);
				settings.socket.send("offer", description);

			}.bind(this), function( error ){

				settings.error(error);

			}, settings.constraints);

			settings.socket.socket.addEventListener("message", function( message ){

				var data = JSON.parse(message.data);

				if( data.type === "offer" ){

					this.reset(settings);

					this.peer.setRemoteDescription(new RTCSessionDescription(data.content), function(){

						this.peer.createAnswer(function( description ){

							this.peer.setLocalDescription(description);
							settings.socket.send("answer", description);

						}.bind(this), function( error ){

							settings.error(error);

						}, settings.constraints);

					}.bind(this), function( error ){

						settings.error(error);

					});

				}
				else if( data.type === "answer" ){

					this.peer.setRemoteDescription(new RTCSessionDescription(data.content), function(){

					}, function( error ){

						settings.error(error);

					});

				}
				else if( data.type === "candidate" ){

					this.peer.addIceCandidate(new RTCIceCandidate(data.content));

				}
				else if( data.type === "close" ){

					this.peer.close();

				};

			}.bind(this), false);

			return this;

		},
		reset: function( settings ){

			this.peer = new RTCPeerConnection(settings.config);

			this.peer.addEventListener("iceconnectionstatechange", function( event ){

				console.log("iceconnectionstatechange", event.target.iceConnectionState);

			}, false);

			this.peer.addEventListener("signalingstatechange", function( event ){

				console.log("signalingstatechange", event.target.signalingState);

			}, false);

			this.peer.addEventListener("icecandidate", function( event ){

				if( !isEmpty(event.candidate) ){

					settings.socket.send("candidate", event.candidate);

				};

			}, false);

			this.addStream(settings.stream);

			this.peer.addEventListener("addstream", function( event ){

				if( isFunction(settings.addStream) ){

					settings.addStream.call(this, window.URL.createObjectURL(event.stream), event.stream);

				};

			}.bind(this), false);

			this.peer.addEventListener("removestream", function( event ){

				if( isFunction(settings.removeStream) ){

					settings.removestream.call(this, event);

				};

			}, false);

			return this;

		},
		addStream: function( stream ){

			this.peer.addStream(stream);

			return this;

		},
		createChannel: function( name, settings ){

			this.channels[name] = new Object();

			this.channels[name].settings = settings = Jo.merge({
				ordered: true,
				maxRetransmitTime: Infinity,
				maxRetransmits: Infinity
			}, settings);

			var channel = this.channels[name].object = this.peer.createDataChannel(name, settings);

			channel.addEventListener("open", function(){

				console.log("data channel is open");

			}, false);

			channel.addEventListener("close", function(){

				console.log("data channel is close");

			}, false);

			channel.addEventListener("error", function( error ){

				console.log("data channel error", error);

			}, false);

			channel.addEventListener("message", function( event ){

				console.log("data channel message", event.data);

			}, false);

			return this;

		},
		closeChannel: function( name ){

			this.channels[name].object.close();

			delete this.channels[name];

			return this;

		},
		resetChannels: function(){

			for( var channel in this.channels ){

				this.createChannel()

			};

			return this;

		}
	};

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

	Jo.easing = function( type, elapsed, duration ){

		return Jo.easing.fn.init(type, elapsed, duration);

	};

	Jo.easing.fn = Jo.easing.prototype = {
		constructor: Jo.easing,
		init: function( type, elapsed, duration ){

			return this[type](elapsed, duration);

		},
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

	Jo.easing.fn.init.prototype = Jo.easing.fn;

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

		return typeof source === "number" || /^[\d\.]+$/gi.test(source.toString()) || (!isNaN(parseFloat(source.toString())) && isFinite(source));

	};

	function isInteger( source ){

		return isNumber(source) && isFinite(number) && source % 1 === 0 && !/\./.test("" + source);

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

	function prepareCSSSelector( selector, output, regroup ){

		var returned = new Array();

		selector = selector.replace(/(?:[a-z0-9]*(?:(?:\.[a-z0-9\-\_]+)?(?:#[a-z0-9\-\_]+)?(?:\[[a-z0-9\-\_]+(?:\=(?:(?:\"[^\"]*\")?(?:\'[^\']*\')?(?:[^\]]*)?)?)?\])?(?:\:[a-z\-]+(?:\((?:[^\)]*)?\))?)?)*\s*[>~]?)*/gi, function( fragment ){

			if( isEmpty(fragment, true) ){

				return "";

			}
			else {

				fragment = fragment.replace(/[>~]?(?:[a-z0-9]*(?:(?:\[[a-z0-9\-\_]+(?:\=(?:(?:\"[^\"]*\")?(?:\'[^\']*\')?(?:[^\]]*)?)?)?\])?(?:\.[a-z0-9\-\_]+)?(?:#[a-z0-9\-\_]+)?(?:\:[a-z\-]+(?:\((?:[^\)]*)?\))?)?)*)*/gi, function( element ){

					if( isEmpty(element, true) ){

						return "";

					}
					else {

						element = element.replace(/\[[a-z0-9\-\_]+(?:\=(?:(?:\"[^\"]*\")?(?:\'[^\']*\')?(?:[^\]]*)?)?)?\]|\.[a-z0-9\-\_]+|#[a-z0-9\-\_]+|\:(first|last|nth|only)(-child|-of-type)?(\((?:[^\)]*)?\))?|[>~]|[a-z0-9]+|\s+|,/gi, function( detail, target, type, number ){

							if( isEmpty(detail, true) ){

								return "";

							}
							else {

								detail = detail.replace(/^\s*\:(first|last|nth|only)(-child|-of-type)?(\((?:[^\)]*)?\))?/, function( match, target, type, number ){

									return ":" + target + (isEmpty(type) ? "-child" : type) + (isEmpty(number) ? "" : number);

								});

							};

							if( output === "detail" ){

								returned.push(detail);

							};

							return detail;

						});

						if( output === "element" ){

							returned.push(element);

						};

						return element;

					};

				});

				if( output === "fragment" ){

					returned.push(fragment);

				}
				else if( output !== "global" ){

					returned.push(",");

				}

				return fragment;

			};

		});

		if( output === "global" ){

			returned.push(selector);

		}
		else if( isTrue(regroup) ){

			var buffer = new Array();
			buffer.push(new Array());

			for( var index = 0, length = returned.length - 1; index < length; index++ ){

				if( !/^\s*,\s*$/.test(returned[index]) ){

					buffer[buffer.length - 1].push(returned[index]);

				}
				else {

					buffer.push(new Array());

				}

			};

			returned = buffer;

		};

		return returned;

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
		else {

			if( from === "px" ){

				if( to === "em" ){

					return value / parseFloat(Jo(element).css("font-size")[0]);

				}
				else if( to === "rem" ){

					return value / parseFloat(Jo(document.documentElement).css("font-size")[0]);

				}
				else if( to === "%" ){

					if( ["left", "width", "marginLeft", "marginRight", "borderLeft", "borderRight", "paddingLeft", "paddingRight"].indexOf(property) !== -1 ){

						return value / element.parentElement.offsetWidth * 100;

					}
					else {

						return value / element.parentElement.offsetHeight * 100;

					};

				}
				else if( to === "pt" ){

					return value * 72 / 96;

				};

			}
			else if( from === "em" ){

				if( to === "px" ){

					return value * parseFloat(Jo(element).css("font-size")[0]);

				}
				else if( to === "rem" ){

					var px = value * parseFloat(Jo(element).css("font-size")[0]); 

					return px / parseFloat(px / parseFloat(Jo(document.documentElement).css("font-size")[0]));

				}
				else if( to === "%" ){

					return convertCSSValue(element, property, convertCSSValue(element, property, value, from, "px"), "px", "%");

				}
				else if( to === "pt" ){

					return convertCSSValue(element, property, convertCSSValue(element, property, value, from, "px"), "px", "pt");

				};

			}
			else if( from === "%" ){

				if( to === "px" ){

					if( ["left", "width", "marginLeft", "marginRight", "borderLeft", "borderRight", "paddingLeft", "paddingRight"].indexOf(property) !== -1 ){

						return element.parentElement.offsetWidth / 100 * value;

					}
					else {

						return element.parentElement.offsetHeight / 100 * value;

					};

				}
				else if( to === "em" ){

					return convertCSSValue(element, property, convertCSSValue(element, property, value, from, "px"), "px", "em");

				}
				else if( to === "rem" ){

					return convertCSSValue(element, property, convertCSSValue(element, property, value, from, "px"), "px", "rem");

				}
				else if( to === "pt" ){

					return convertCSSValue(element, property, convertCSSValue(element, property, value, from, "px"), "px", "pt");

				};

			}
			else if( from === "pt" ){

				if( to === "px" ){

					return value * 96 / 72;

				}
				else if( to === "em" ){

					return convertCSSValue(element, property, convertCSSValue(element, property, value, from, "px"), "px", "em");

				}
				else if( to === "rem" ){

					return convertCSSValue(element, property, convertCSSValue(element, property, value, from, "px"), "px", "rem");

				}
				else if( to === "%" ){

					return convertCSSValue(element, property, convertCSSValue(element, property, value, from, "px"), "px", "%");

				};

			};

		};

	};

	function getNodesXPath( path, element ){

		var returned = new Array();

		if( isEmpty(element) ){

			element = document;

		}
		else if( !isTag(element) ){

			return returned;

		};

		var XPath = new XPathEvaluator();
		var NSResolver = XPath.createNSResolver(element.ownerDocument === null ? element.documentElement : element.ownerDocument.documentElement);

		var evaluated = XPath.evaluate(selector, element, NSResolver, 0, null);

		while( node = evaluated.iterateNext() ){

			returned.push(node);

		};

		return returned;

	};

	function getNodes( selector, element ){	

		var returned = new Array();

		if( isEmpty(element) ){

			element = documentRoot;

		}
		else if( !isTag(element) ){

			return returned;

		};

		var removeIdAfter = false;
		var originElement = element;

		if( /^\s*[>~]/gi.test(selector) ){

			if( isEmpty(element.getAttribute("id"), true) ){

				removeIdAfter = true;
				element.setAttribute("id", "Jo_" + Math.random().toString(36).substr(2, 9) + new Date().getTime().toString(36));

			};

			selector = "#" + element.id + " " + selector;
			element = document;

		};

		selector = prepareCSSSelector(selector, "fragment");

		for( var selected = 0, selectedLength = selector.length; selected < selectedLength; selected++ ){

			var selection = selector[selected];

			var more = {
				option: null,
				target: null
			};

			selection = selection.replace(/\s*([>~]?)\s*(text|comment)\s*$/, function( match, option, target ){

				more.target = target;
				more.option = option;

				return "";

			});

			var nodes;

			if( !isEmpty(selection, true) ){

				nodes = element.querySelectorAll(selection);

			}
			else {

				nodes = [originElement];

			};

			if( isEmpty(more.target) ){

				for( var node = 0, nodesLength = nodes.length; node < nodesLength; node++ ){

					returned.push(nodes[node]);

				};

			}
			else {

				for( var node = 0, nodesLength = nodes.length; node < nodesLength; node++ ){

					var origin = nodes[node];
					var treeFilter;

					if( more.target === "text" ){

						treeFilter = NodeFilter.SHOW_TEXT;

					}
					else if( more.target === "comment" ){

						treeFilter = NodeFilter.SHOW_COMMENT;

					};

					if( more.option === "~" ){

						origin = origin.parentElement; 

					};

					var treeWalker = document.createTreeWalker(origin, treeFilter, {
						acceptNode: function( match ){

							if( isEmpty(more.option, true) ){

								return NodeFilter.FILTER_ACCEPT;

							}
							else if( match.parentElement === origin ){

								return NodeFilter.FILTER_ACCEPT;

							};

							return NodeFilter.FILTER_REJECT;

						}
					});

					while( treeWalker.nextNode() ){

						returned.push(treeWalker.currentNode);

					};

				};

			};

		};

		if( isTrue(removeIdAfter) ){

			originElement.removeAttribute("id");

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

		return text.replace(/-([a-z])/g, function( match, letter ){

			return letter.toUpperCase();

		});

	};

	function uncamelize( text ){

		return text.replace(/([A-Z])/g, "-$1").toLowerCase();

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
		length: /(\-?\s*\d*\.?\d+)(em|ex|grad|ch|deg|ms|rad|rem|s|turn|vh|vw|vmin|vmax|px|cm|in|pt|pc|%)/gi, //!!! < ?
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

	var specialEvents = {
		special: function( fn ){

			return {
				action: "correctEventType",
				fn: fn
			};

		}
	};

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})(window);