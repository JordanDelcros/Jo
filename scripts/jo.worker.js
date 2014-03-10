(function( self, undefined ){

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

			if( isEmpty(useCapture) ){

				useCapture = false;

			};

			if( isEmpty(self.events[action]) )

		},
		off: function( action, fn ){

			if( isBoolean(fn) ){

				useCapture = fn;
				fn = undefined;

			};

			if( isEmpty(useCapture) ){

				useCapture = false;

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