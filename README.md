# Javascript overloaded (beta 1) 

Jo is a Javascript library to make the same as pure JS with less code.

## How to use ?
Like every Javascript library, link JS file into HTML head or body end
`<script type="text/javascript src="path/to/Jo.js></script>`

Now you can use `Jo` or `$` like this `$("section")` to get nodes in the DOM.

Then you can use methods like this one `$("section").css("background-color", "#FF00FF");`.

## Methods

### find( selector )
Found all tags in each elements.
Return Jo object.
- **selector _[string]_** is the selector to found.
```js
  $("section").find("div ul > li a[href^='https://']");
```

### child( selector )
Found all nodes contained as direct childrens.
Return Jo object.
- **selector _[string]_** is the selector to found.
```js
  $("section").child("div");
```

### node( selector, normalize )
Found all nodes contained in the selector.
Return Jo object.
- **selector _[string]_** is the selector to found.
- **normalize _[boolean]_** let you choose if undesired whitespace must be erease. Default is false.
```js
 $("section").node("div ul:first > li");
```

### item( number )
Select node in the Jo.found array (do not confound with a :nth- selector).
Return Jo object.
- **number _[integer]_** is the index to found in the array.
```js
  $("section").find("div").item(0);
```

### each( fn )
Execute function for each found node in the Jo.found array (this become the node).
Return Jo object.
- **fn _[function]_** is the function to execute. 
```js
  $("section").find("div ul:first > li").each(function(){
  
    $(this).find("a").css("text-decoration", "underline");
  
  });
```
### is( selector )
Compare found nodes in Jo.found array to the selector and return a boolean, true if all match or false if one fail.
Return boolean.
- **selector _[string]_** is the selector to found.
```js
  if( $("section").find("div ul:first > li > *").is("a[href^='https://']") ){
  
    console.log("I match");
  
  }
  else {
  
    console.log("I do not match");
  
  };
```

### on( action, fn, useCapture )
Add event listener to each node in the Jo.found array.
Return Jo object
- **action _[string]_** is the event name to add, it can be a standard event (like "click", "mouseenter", "keyup"...) or a custom event (like "yeah", "catchPokemon", "myEvent"...).
- **fn _[function]_** is the function to execute when the event happen.
- **useCapture _[boolean, optional]_** let you choose between capture (true) or bubble (false) event. Default is false.
```js
  $("section").find("a").on("click", function(){
  
    event.preventDefault();
  
    if( confirm("Are you sure you want to leave this page ?") === true ){
    
      // do stuff
    
    };
  
  }, false);
```

### off( action, fn[, useCapture] )
Remove event listener to each node in the Jo.found array.
Return Jo object.
- **action _[string]_** is the event name to remove, it can be a standard event (like "click", "mouseenter", "keyup"...) or a custom event (like "yeah", "catchPokemon", "myEvent"...).
- **fn _[function, optional]_** is the function to remove, cause the same action can be added multiple time with different functions. If undefined, all event with this action will be removed.
- **useCapture _[boolean, optional]_** let you choose between capture (true) or bubble (false) event. Default is false.

```js
  var fn = function(){
  
    event.preventDefault();
    
    $(this)
      .off("click", fn, false)
      .off("yeah");

  };
  
  $("a")
    .on("click", fn, false)
    .on("yeah", function(){
    
      alert("Yeah! You click me!");
    
    };
  
  setTimeout(function(){
  
    $("a").off("yeah");
  
  }, 10000);
  
```

### trigger( action )
Trigger the event, it have been called or not.
Return Jo object.
- **action _[string]_** the action to trigger.
```js
   $("section").find("a").on("click", function(){
  
    event.preventDefault();
  
    if( confirm("Are you sure you want to leave this page ?") === true ){
    
      // do stuff
    
    };
  
  }, false);

  $("a").trigger("click");
```

### attr( name, value )
Set or get tag attribute.
Return Jo object.
- **name _[string|object|array]_** the attribute to set or get. If is an object, set each attributes. If is an array, get each attributes in object.
- **value _[string]_** the value to set or if empty, it will return the attribute value.
```js
  var width = $("img").item(0).attr("width");
  var height = $("img").item(0).attr("height");
  
  $("img")
    .attr("width", width)
    .attr({
      height: height,
      alt: $("img").item(0).attr("alt")
    });
```

- css
- is
- insertBefore
- insertAfter
- insertStart
- insertEnd
- replace
- remove
- hide
- show
- addClass
- removeClass

- length
- merge
- ajax
- socket

- worker
- - send
- - receive / on
- - terminate

## To do/see
- Blob
- WebSQL database -> window.openDatabase()
- geolocation
- offline application
- localStorage SessionStorage
- Workers / Messaging <--- execute un js totalement inaccessible pour l'utilisateur ? So safe :D

- $('html').bind('paste', function(e) {
  e.preventDefault();
  var item = (e.clipboardData || e.originalEvent.clipboardData).items[0];
  var type = item.type.split('/').shift();
  if (type == "image"){
    var file = item.getAsFile();
    var blob = URL.createObjectURL(file); // Blob
    window.open(blob);
  }
});
