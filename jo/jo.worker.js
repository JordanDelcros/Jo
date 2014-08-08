(function( self, undefined ){

	self.events = new Object();

	var methods = {
		send: function( type, data ){

			self.postMessage({
				type: type,
				content: data
			});

		},
		receive: function( type, fn ){

			self.addEventListener("message", function( message ){

				if( message.data && message.data.type === type ){

					fn(message);

				};

			}, false);

		},
		on: function( action, fn ){

			if( isEmpty(self.events[action]) ){

				self.events[action] = new Array();

			};

		},
		off: function( action, fn ){

			if( !isEmpty(fn) ){

				for( var e in self.events[action]  ){

					if( fn === self.events[action][e] ){

						delete self.events[action][e];

					}
					else {

						delete self.events[action];

					};

				};

			};

		},
		error: function(){

			

		}
	};

	for( var method in methods ){

		if( methods.hasOwnProperty(method) ){

			self[method] = methods[method];

		};

	};

	self.test = {
		loop: function( type, arguments ){

			var argumentsArray = new Array();

			for( var argument in arguments ){

				if( arguments.hasOwnProperty(argument) ){

					argumentsArray.push(arguments[argument]);

				};

			};

			self.send("console", {
				type: type,
				content: argumentsArray
			});

		},
		memory: function(){

			this.loop("memory", arguments);

		},
		debug: function(){

			this.loop("debug", arguments);

		},
		error: function(){

			this.loop("error", arguments);

		},
		info: function(){

			this.loop("info", arguments);

		},
		log: function(){

			this.loop("log", arguments);

		},
		warn: function(){

			this.loop("warn", arguments);

		},
		dir: function(){

			this.loop("dir", arguments);

		},
		dirxml: function(){

			this.loop("dirxml", arguments);

		},
		table: function(){

			this.loop("table", arguments);

		},
		trace: function(){

			this.loop("trace", arguments);

		},
		assert: function(){

			this.loop("assert", arguments);

		},
		count: function(){

			this.loop("count", arguments);

		},
		markTimeline: function(){

			this.loop("markTimeline", arguments);

		},
		profile: function(){

			this.loop("profile", arguments);

		},
		profileEnd: function(){

			this.loop("profileEnd", arguments);

		},
		time: function(){

			this.loop("time", arguments);

		},
		timeEnd: function(){

			this.loop("timeEnd", arguments);

		},
		timeStamp: function(){

			this.loop("timeStamp", arguments);

		},
		timeline: function(){

			this.loop("timeline", arguments);

		},
		timelineEnd: function(){

			this.loop("timelineEnd", arguments);

		},
		group: function(){

			this.loop("group", arguments);

		},
		groupCollapsed: function(){

			this.loop("groupCollapsed", arguments);

		},
		groupEnd: function(){

			this.loop("groupEnd", arguments);

		},
		clear: function(){

			this.loop("clear", arguments);

		},
	};

})(self);