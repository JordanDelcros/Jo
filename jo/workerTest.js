"use strict";
importScripts("jo.worker.js");

receive("special", function( message ){

	send("pokemon", "test");

});