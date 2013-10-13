(function( window, undefined ){

	var html = document.getElementsByTagName("html")[0];

	var Jo = function( selector, context ){
		return new Jo.fn.init(selector, context);
	};

	Jo.fn = Jo.prototype = {
		Jo: "0.1",
		constructor: Jo,
		init: function( selector, context ){

			var returned;

			if( !selector ) return this;

			if( isString(selector) ){

				returned = parseSelector(selector);
			
			};

			return returned;

		},
		each: function( data ){
		}
	};

	function isEmpty( source ){

		if( isObject(source) || isArray(source) ){

			var counter = 0;

			for( var key in source) counter++;

			if( counter <= 0 ){
				return true
			}
			else {
				false
			};

		}
		else if( source === undefined || source === null || source === false || source === "" ){


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

		if( typeof source === "number" ){
			return true;
		}
		else {
			return false;
		};

	};

	function isString( source ){

		if( typeof source === "string" || source instanceof String ){
			return true;
		}
		else {
			return false;
		};

	};

	function isArray( source, strict ){

		if( typeof source === "array" || source instanceof Array ){
			return true;
		}
		else {
			return false;
		};

	};

	function isObject( source ){

		if( typeof source === "object" || source instanceof Object ){
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

	function arrayRemove( index, array ){

		array.splice(index, 1);

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

		// TO STORE DOM ELEMENT FOUNDED
		var returned = new Array();

		// TO STORE OBJECT FOUND
		var founded = new Array();

		// REMOVE UNEXPECTED SPACE ON SPECIAL SYMBOLS
		// AND SPLIT EVERY COMMA
		var strings = selector.replace(/\s*([<>:])\s*/ig, "$1").split(/\s*,\s*/ig);

		for( var key = 0; key < strings.length; key++ ){

			var objects = new Array();

			// SPLIT ON SPACE TO GET EACH SELECTOR PART
			strings[key] = strings[key].split(/\s+/ig);

			for( var subkey in strings[key] ){

				if( strings[key][subkey].match(/\>/ig) ){

					var stringSplit = strings[key][subkey].split(/\>/ig);

					for( var i = 0; i < stringSplit.length; i++ ){

						if( !isEmpty(stringSplit[i]) ) var object = selectorToObject(stringSplit[i], (i > 0) ? true : false);

						objects.push(object);

					};

				}
				else {

					var object = selectorToObject(strings[key][subkey], false);

					objects.push(object);
	
				};

			};

			founded.push(objects);

		};

		for( var key in founded ){

			parseChilds(document, founded[key], returned);

		};

		return returned;

	};

	function selectorToObject( string, isDirectChild ){

		var returned = new Object();

		returned.string = string;

		if( isDirectChild === true ) returned.isDirectChild = true;

		// IF CONTAIN TAG
		if( returned.string.match(/^\w+/ig) ){

			returned.tag = returned.string.match(/^\w+/ig)[0];

		};

		// IF CONTAIN ID
		if( returned.string.match(/#/ig) ){

			if( !returned.attributes ) returned.attributes = new Array();

			returned.attributes.push({
				name: "id",
				estate: "=",
				value: /#(\w+)/ig.exec( returned.string )[1]
			});

		};

		// IF CONTAIN CLASS
		if( returned.string.match(/\./ig) ){

			if( !returned.attributes ) returned.attributes = new Array();

			returned.attributes.push({
				name: "class",
				estate: "=",
				value: /\.(\w+)/ig.exec( returned.string )[1]
			});

		};

		// IF CONTAIN OTHER ATTRIBUTS
		if( returned.string.match(/\[/ig) ){

			if( !returned.attributes ) returned.attributes = new Array();

			var attributes = returned.string.match(/\[[\w-]+\W+[^\]]*\]/ig);

			for( var attribute in attributes ){

				var datas = /\[([\w-]+)(\W+)([^\]]*)/ig.exec(attributes[attribute]);

				returned.attributes.push({
					name: datas[1],
					estate: datas[2],
					value: datas[3]
				});

			};
		
		};

		// IF CONTAIN PSEUDO
		if( returned.string.match(/:/ig) ){

			if( !returned.pseudos ) returned.pseudos = new Object();

			var pseudos = returned.string.match(/:([\w-]+)(\(([^\)]+)\))?/ig);

			for( pseudo in pseudos ){

				var datas = /:([\w-]+)(\(([^\)]+)\))?/ig.exec(pseudos[pseudo]);

				returned.pseudos[datas[1]] = datas[3] ? datas[3] : null;

			};


		};

		return returned;

	};

	function parseChilds( element, desired, array, toFound ){


		var desiredClone = clone(desired);

		if( isEmpty(toFound) ) toFound = desiredClone[desiredClone.length - 1];

		if( isEmpty(desiredClone) ){

			if( element.tagName.toLowerCase() === toFound.tag ){

				array.push(element);
				
			};

			return array;

		};

		if( !isEmpty(desiredClone[0]) && desiredClone[0].isDirectChild === true ){

			var childrens = element.children;

		}
		else {

			var childrens = element.getElementsByTagName(desiredClone[0].tag);

		};

		desiredClone = arrayRemove(0, desiredClone);

		for( var child = 0; child < childrens.length; child++ ){

			if( !childrens[child].nodeType === 1 ) continue;

			parseChilds(childrens[child], desiredClone, array, toFound);

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

	Jo.fn.init.prototype = Jo.fn;

	if( isObject(window) && isObject(window.document) ) window.Jo = window.$ = Jo;

})( window );