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

				found = parseSelector(selector);
			
			};

			return this;

		},
		each: function( data ){
		}
	};

	function isEmpty( source ){

		if( typeof source === undefined || typeof source === null || source === false || source === "" ){
			return true;
		}
		else {
			return false;
		};

	};

	function isBool( source ){

		if( typeof source === "boolean" ){
			return true;
		}
		else {
			return false;
		};

	};

	function isNumber( source ){

		if( !isEmpty(source) && typeof source === "number" ){
			return true;
		}
		else {
			return false;
		};

	};

	function isString( source ){

		if( !isEmpty(source) && (typeof source === "string" || source instanceof String) ){
			return true;
		}
		else {
			return false;
		};

	};

	function isArray( source, strict ){

		if( !isEmpty(source) && (typeof source === "array" || source instanceof Array) ){
			return true;
		}
		else {
			return false;
		};

	};

	function isObject( source ){

		if( !isEmpty(source) && (typeof source === "object" || source instanceof Object) ){
			return true;
		}
		else {
			return false;
		};

	};

	function arrayIndexReset( array ){

		var returned = new Array();

		for( var key in array ){

			returned.push(array[key]);

		};

		return returned;

	};

	function arrayRemoveFirst( array ){

		array.shift();

		return arrayIndexReset(array);

	};

	function objectToArray( object ){

		var returned = new Array();

		for( var key in object ){

			returned[key] = object[key];

		};

		return returned;

	};

	function clone( variable ){

		if( !isObject(variable) || isEmpty(variable) ) return variable;

		var newInstance = variable.constructor();

		for( var key in variable ){
			newInstance[key] = clone(variable[key]);
		};

		return newInstance;

	};

	// PARSE CSS SELECTORS
	function parseSelector( selector ){

		var returned = new Array();

		// REMOVE UNEXPECTED SPACE ON SPECIAL SYMBOLS
		selector = selector.replace(/\s*([<>:])\s*/ig, "$1").split(/\s*,\s*/ig);

		// SPLIT SPACE FOREACH SELECTOR
		for( var key in selector ) selector[key] = selector[key].split(/\s+/ig);

		// TRANSFORM SELECTOR STRING TO DETAILED OBJECT
		for( var key in selector ){

			for( subkey in selector[key] ){

				var object = new Object();

				object.string = selector[key][subkey];

				// IF CONTAIN TAG
				if( object.string.match(/^\w+/ig) ){

					if( object.string.match(/\>/ig) ){

						object.tag = new Array();

						var tags = object.string.split(/>/ig);

						for( var tagKey in tags ){

							object.tag[tagKey] = tags[tagKey].match(/^\w+/ig)[0];

						};

					}
					else {
					
						object.tag = object.string.match(/^\w+/ig)[0];

					};

				};

				// IF CONTAIN ID
				if( object.string.match(/#/ig) ){

					if( !object.attributes ) object.attributes = new Array();

					object.attributes.push({
						name: "id",
						estate: "=",
						value: /#(\w+)/ig.exec( object.string )[1]
					});

				};

				// IF CONTAIN CLASS
				if( object.string.match(/\./ig) ){

					if( !object.attributes ) object.attributes = new Array();

					object.attributes.push({
						name: "class",
						estate: "=",
						value: /\.(\w+)/ig.exec( object.string )[1]
					});

				};

				// IF CONTAIN OTHER ATTRIBUTS
				if( object.string.match(/\[/ig) ){

					if( !object.attributes ) object.attributes = new Array();

					var attributes = object.string.match(/\[[\w-]+\W+[^\]]*\]/ig);

					for( var attribute in attributes ){

						var datas = /\[([\w-]+)(\W+)([^\]]*)/ig.exec(attributes[attribute]);

						object.attributes.push({
							name: datas[1],
							estate: datas[2],
							value: datas[3]
						});

					};
				
				};

				// IF CONTAIN PSEUDO
				if( object.string.match(/:/ig) ){

					if( !object.pseudos ) object.pseudos = new Object();

					var pseudos = object.string.match(/:([\w-]+)(\(([^\)]+)\))?/ig);

					for( pseudo in pseudos ){

						var datas = /:([\w-]+)(\(([^\)]+)\))?/ig.exec(pseudos[pseudo]);

						object.pseudos[datas[1]] = datas[3] ? datas[3] : null;

					};


				};

				var elements;
				var returned = new Array();

				// GETTING DOM ELEMENTS
				if( object.tag ){

					if( isArray(object.tag) ){

						elements = document.getElementsByTagName(object.tag[0]);

						if( !isEmpty(elements) ){

							parseDirectChilds(elements, object, returned);

						};

					}
					else {

						elements = document.getElementsByTagName(object.tag);

						for( var subElement in elements ){

							returned.push(elements[subElement]);

						};

					};

				};

				console.log(object);

				console.log("domB", returned );

				selector[key][subkey] = object;

			};

		};

		console.log( selector );

		return returned;

	};

	// PARSE CHILDS RECURSIVELY
	function parseDirectChilds( elements, desired, array ){

		if( !isArray(elements) ){

			if( elements instanceof NodeList ){

				elements = objectToArray(elements);

			}
			else {

				elements = [elements];

			};

		};

		for( var el = 0; el < elements.length; el++ ){

			if( desired.tag.length === 1 && elements[el].tagName.toLowerCase() === desired.tag[0] ){

				array.push(elements[el]);
			
			};

			if( elements[el].nodeType === 1 ){

				var childrens = elements[el].children;

				if( childrens.length > 0 && desired.tag.length > 1 ){

					var desiredClone = clone(desired);
					desiredClone.tag.shift();
					
					for( var child = 0; child < childrens.length; child++  ){

						if( childrens[child].nodeType === 1 ){

							parseDirectChilds(childrens[child], desiredClone, array);

						};

					};

				};

			};

		};

		return array;

	};

	Jo.infos = function(){

		console.log({
			Jo: "0.1",
			author: "Jordan Delcros",
			author_github: "JordanDelcros",
			author_website: "http://www.jordan-delcros.com"
		});

	};

	Jo.fn.init.prototype = Jo.fn;

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})( window );