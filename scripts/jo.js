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

					var DOMelements = new Array();

					// GETTING DOM ELEMENTS
					if( object.tag ){

						if( typeof object.tag === "object" ){

							element = document.getElementsByTagName(object.tag[0]);

							for( var subElement in element ){

								var childs = element[subElement].childNodes;
								var toDOMelements = new Array();

								if( !childs ) continue;

								for( var child = 0; child < childs.length; child++ ){

									if( childs[child].nodeType === 1 ) parseChilds(childs[child], toDOMelements);

									DOMelements.push(toDOMelements[toDOMelements.length - 1]);

									toDOMelements = [];

								};

							};							

						}
						else {

							element = document.getElementsByTagName(object.tag);

							for( var subElement in element ){

								DOMelements.push(element[subElement]);

							};

						};

					};

					console.log("dom", DOMelements )

					selector[key][subkey] = object;

				};

			};

			console.log( selector );

			return returned;

		},
		each: function( data ){
			
			console.log(data);

			return this;

		}
	};

	// PARSE CHILDS RECURSIVELY
	function parseChilds( element, descendants ){

		descendants.push(element);

		var children = element.childNodes;
		
		for( var i = 0; i < children.length; i++ ){
			
			if (children[i].nodeType == 1) parseChilds(children[i], descendants);
		
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

	if( typeof window === "object" && typeof window.document === "object" ) window.Jo = window.$ = Jo;

})( window );

// header#first75_2:hello.class h1.title > span, header>h1 > span , section p