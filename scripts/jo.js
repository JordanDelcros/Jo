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

				found = Jo.fn.parseSelector(selector);
			
			};

			return this;

		},
		parseSelector: function( selector ){

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

						if( typeof object.tag === "object" ){

							elements = document.getElementsByTagName(object.tag[0]);

							if( !isEmpty(elements) ){

								parseChilds(elements, object, returned);

							};

						}
						else {

							elements = document.getElementsByTagName(object.tag);

							for( var subElement in elements ){

								returned.push(elements[subElement]);

							};

						};

					};

					console.log("domB", returned );

					selector[key][subkey] = object;

				};

			};

			// console.log( selector );

			return returned;

		},
		each: function( data ){
		}
	};

	function isEmpty( source ){

		if( source === undefined || source === null || source === "" || source.length <= 0 ){
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

	function isArray( source ){

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

	// PARSE CHILDS RECURSIVELY
	function parseChilds( elements, desired, descendants ){


		// PUT ELEMENTS INTO ARRAY CONTAING ITSELF
		if( !isArray(elements) ){

			if( elements instanceof NodeList ){

				elements = objectToArray(elements);

			}
			else {

				elements = [elements];

			};

		};

		for( var element = 0; element < elements.length; element++ ){

			console.log( elements[element] );

			if( elements[element].tagName.toLowerCase() === desired.tag[0] && desired.tag.length === 1 ){

				descendants.push(elements[element]);
			
			};


			if( elements[element].nodeType === 1 ){

				var childrens = elements[element].childNodes;

				if( childrens.length > 0 ){

					for( var child = 0; child < childrens.length; child++  ){

						if( childrens[child].nodeType === 1 ){

							parseChilds(childrens[child], desired, descendants);

						};

					};

				};

			};

		};

		// !!!! v2
		// !!!!
		// !!!!
		// !!!!

		// console.log( "el", elements );

		// if( desired.tag.length === 1 ){

		// 	if( elements.tagName.toLowerCase() === desired.tag[0] ){

		// 		descendants.push(elements);

		// 	};

		// };
		
		// var childrens = elements.childNodes;
		// console.log( "ch",childrens );

		// desired.tag = arrayRemoveFirst(desired.tag);

		// if( childrens.length > 0 ){

		// 	for( var key in childrens.length ){

		// 		if( childrens[key].nodeType === 1 ){

		// 			parseChilds(childrens[key], desired, descendants);

		// 		};

		// 	};

		// };

		// !!!! v1
		// !!!!
		// !!!!
		// !!!!

		// if( !isNumber(counter) ) var counter = 0;

		// var children = element.childNodes;

		// console.log( "so: ", element.tagName.toLowerCase(), desired.tag[counter], counter, desired.tag.length );

		// if( element.tagName.toLowerCase() === desired.tag[counter - 1] && counter === desired.tag.length ){
		
		// 	descendants.push(element);

		// 	return descendants;
		
		// };
		
		// for( var i = 0; i < children.length; i++ ){
			
		// 	if( children[i].nodeType === 1 ){

		// 		if( !element.tagName === desired.tag[counter] ) continue;

		// 		counter++;

		// 		parseChilds(children[i], desired, descendants, counter);

		// 	};
		
		// };

		// return descendants;

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

	if( typeof window === "object" && typeof window.document === "object" ) window.Jo = window.$ = Jo;

})( window );

// header#first75_2:hello.class h1.title > span, header>h1 > span , section p