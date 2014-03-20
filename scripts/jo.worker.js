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

})(self);