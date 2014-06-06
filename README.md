# Javascript Overloaded (beta 1) 

Jo is a JavaScript framework to make the same as pure JS with less code.

## How to use ?
Like every JavaScript library, simply link the JS file into an HTML `<head>` or `<body>` tag.
`<script type="text/javascript src="path/to/jo.js></script>`

Now you can use `Jo` or `$` like that `$("section")` to get the nodes from the DOM.

Then you can use methods like this one `$("section").css("background-color", "#456DA0");`.

## Documentation

### Methods

#### find( _selector_ )
Found all descendants tags from each element.

Return Jo object.
- **selector _[string]_** is the selector to found.
```js
  $("section").find("div:first-child ul > li > a[href^='http']");
```

#### node( _selector_, _normalize_ )
Found all descendants nodes into each element.
Return Jo object.
- **selector _[string(optional)]_** is the selector to found.
- **normalize _[boolean(optional)]_** let you choose if undesired whitespaces must be erased. _Default is false_
```js
 $("section").node("div:first-child ul > li");
```

#### child( _selector_ )
Found all immediate descendants nodes from each element.
Return Jo object.
- **selector _[string]_** is the selector to found.
```js
  $("section").child("div");
```

#### parent( _selector_ )
Found all immediate ascendants tags from each element.
Return Jo object.
- **selector _[string(optional)]_** is the selector to found.
```js
  $("section").parent("div");
```

#### parents( _selector_ )
Found all ascendants tags from each element.
Return Jo object.
- **selector _[string(optional)]_** is the selector to found.
```js
  $("div").parents("section, article, footer");
```

#### item( _index_ )
Select one element from the Jo.found array (do not confound with th :nth-* selector).
Return Jo object.
- **number _[integer]_** is the index to found in the array.
```js
  $("section").item(0);
```

#### prev( _selector_ )
Found previous element from each element
Return Jo object
- ** selector _[string(optional)]_** is the selector to found
```js
  $("ul li:nth-child(4)").prev(":nth-child(2)");
```

#### next( _selector_ )
Found previous element from each element
Return Jo object
- ** selector _[string(optional)]_** is the selector to found
```js
  $("ul li:nth-child(4)").next(":nth-child(6)");
```

#### each( fn )
Execute function for each found node in the Jo.found array (this become the current node).
Return Jo object.
- **fn _[function]_** is the function to execute. 
```js
  $("section").find("div ul:first > li").each(function( index ){
  
    $(this).find("a").css("color", "#456DA0");
  
  });
```

#### is( selector )
Compare found elements in Jo.found array to the selector and return a boolean, true if all match or false if one fail.
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

#### on( action, fn, useCapture )
Add event listener to each element.
Return Jo object
- **action _[string]_** is the event name to add, it can be a standard event (like "click", "mouseenter", "keyup"...) or a custom event (like "yeah", "catchPokemon", "myEvent"...). You can also add multiple events a time by separating them by a space (like "click yeah catchPokemon"...)
- **fn _[function]_** is the function to execute when the event happened.
- **useCapture _[boolean, optional]_** let you choose between capture (true) or bubble (false) event. Default is false.
```js
  $("section").find("a").on("click", function(){
  
    event.preventDefault();
  
    if( confirm("Are you sure you want to leave this page ?") === true ){
    
      // do stuff
    
    };
  
  }, false);
```

#### off( action, fn[, useCapture] )
Remove event listener to each element.
Return Jo object.
- **action _[string]_** is the event name to remove, it can be a standard event (like "click", "mouseenter", "keyup"...) or a custom event (like "yeah", "catchPokemon", "myEvent"...). You can also remove multiple events a time by separating them by a space (like "click yeah catchPokemon"...)
- **fn _[function, optional]_** is the function to remove, cause the same action can be added multiple time with different functions. If undefined, all function for this action will be removed.
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
    
      alert("Yeah! You click me in time!");
    
    };
  
  setTimeout(function(){
  
    $("a").off("yeah");
  
  }, 10000);
  
```

#### trigger( action )
Trigger an event on each elements, it have been called or not.
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

#### attr( _name_, _value_ )
Set or get attributes.
Return Jo object or string containg attribute value or object containing attributes values.
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
    
  var attrs = $("img").attr(["width", "height", "alt"]);
```

#### width( _width_ )
Set or get width of each element.
Return Jo object or array containg width integer.
-**width _[string(optional)]_** is the size in standard css ("10px", 10%, "10em", ...) you want to set to the elements.
```js
  var bodyWidth = $("body").width()[0];
  var sectionWidth = $("section:fist").width()[0];
  
  $("section:first").width(bodyWidth / sectionWidth * 100 + "%");
```

#### height( _height_ )
Set or get height of each element.
Return Jo object or array containg height integer.
-**height _[string(optional)]_** is the size in standard css ("10px", 10%, "10em", ...) you want to set to the elements.
```js
  var bodyHeight = $("body").height()[0];
  var sectionHeight = $("section:fist").height()[0];
  
  $("section:first").height(bodyHeight / sectionHeight * 100 + "%");
```

#### css( _property_, _value_, _unverified_ )
Set or get styles.
Return Jo object or string containg style value or object containing styles values.
-**property _[string|object|array]_** is the property to get/set
-**value _[string|]_** is the value to set
-**unverified _[boolean]_** if true, dont check for prefixing (fastest)
```js

  var border = $("div").css("border");
  var styles = $("div").css(["margin", "padding", "outline"]);

  $("section")
    .css("outline", styles.outline)
    .css({
      border: border,
      margin: styles.margin,
      padding: styles.padding
    });

```

#### is( selector )
Compare each element to the CSS selector. Return true if all nodes match or false if only one fail.
Return boolean.
- **selector _[string]_** is the selector to compare with.
```js
  var $divs = $("section div");

  $divs.each(function(){

    if( $(this).is("div[data-type^='elements'][draggable]:nth-of-type(1)") ){

      $(this).css("border", "1px solid green");

    };

  });
```

#### addClass( class )
Add a class to each element
Return Jo object.
- ** class _[string]_ ** is the class name to add
```js
  $("section div ul > li").addClass("firstLayout");
```

#### removeClass( class )
Remove a class to each element
Return Jo object.
- ** class _[string]_ ** is the class name to remove
```js
  $("section div ul > li:nth(2n+1)").removeClass("firstLayout");
```

#### html( html )
Get or Set HTML content of each element
Return Jo object
- **html _[string|nodeList|node]_**

#### insertBefore( html )
Add html before (outer) each nodes found in the Jo.found array.
Return Jo object.
- **html _[string|node|nodelist|jo]_** is the code to insert before.
```js
  $("section > div").insertBefore("<h2>title2</h2>");
```

### insertAfter( html )
Add html after (outer) each nodes found in the Jo.found array.
Retrurn Jo;
- **html _[string|node|nodelist|jo]_** is the code to insert after.
```js
  $("section > div").insertAfter("<h2>title2</h2>");
```

### insertStart( html )
Add html to the start (inner) of each nodes found in the Jo.found array.
Retrurn Jo;
- **html _[string|node|nodelist|jo]_** is the code to insert after.
```js
  $("section").insertStart("<h2>title2</h2>");
```

### insertEnd( html )
Add html to the end (inner) of each nodes found in the Jo.found array.
Retrurn Jo;
- **html _[string|node|nodelist|jo]_** is the code to insert after.
```js
  $("section").insertEnd("<h2>title2</h2>");
```

### replace( html )
Replace all nodes found in Jo.found array by new html
Return Jo object.
**html _[string|node|nodeList|jo]_** is the html to replace by.
```js
  $("section > div").replace("<article/>");
```


### remove()
Remove all nodes found in Jo.found array.
Return Jo object.
```js
  $("body > *").remove();
```

### hide()
Display none all nodes found in Jo.found array.
Return Jo object.
```js
  $("a").on("click", function(){

    $(this).hide();

  }, false);
```

### show()
Back to the last display type (inline or css).
Return Jo object.
```js
  $("a").show();
```
### addClass( className )
Add class to all nodes found in the Jo.found array.
Return Jo object.
**className _[string]_** is the class to add.
```js
  $("section div").addClass("viewed");
```

### removeClass( className )
Remove class to all nodes found in the Jo.found array.
Return Jo object.
**className _[string]_** is the class to remove.
```js
  $("section div").removeClass("viewed");
```

## Variables

### found
Array containing nodes found.
```js
  var firstDiv = $("div").found[0];
```

### length
Integer representing how many nodes have been found in Jo.found array.
```js
  if( $("body > section").length > 0 ){

    $("body").insertStart("<p>found</p>");

  };
```

### merge( return[, object[, object...]] )
Merge an infinite of object into one
Return an object depending on content to merge.
```js
  var old = new Array("one", "two", "three");
  var fresh = new Object();
  fresh.four = 4;
  fresh.five = new Array("element", "elementAgain");

  $.merge(old, fresh);

```

### ajax( settings )
Instantiate XMLHTTPRequest.
```js
  $.ajax({
    method: "POST",
    url: "pages/map.html",
    data: {
      longitude: 48.5,
      latitude: 2.2
    },
    type: "html",
    async: true,
    initialize: function(){},
    open: function(){},
    send: function(){},
    receive: function(){},
    complete: function(){},
    error: function(){}
  });
```

### socket( settings )
Instantiate WebSocket connection
**settings _[object]_** are the settings to apply to the socket.
```js
  var socket = $.socket({
    url: "www.mysocketServer.js",
    secure: false,
    open: function(){},
    close: function(){},
    send: function(){},
    receive: function(){},
    error: function(){}
  });
```

### worker( settings )
**settings _[object]_** are the settings to apply to the worker
```js
  $.worker({
    url: "scripts/webgl.js",
    send: function(){},
    receive: function(){},
    error: function(){}
  });
```

#### send
#### receive / on
#### terminate

## To-do/see
- in node() method, dont remove undesired nodes, just dont get them in found array

- Blob
- WebSQL database -> window.openDatabase()
- geolocation
- offline application
- localStorage SessionStorage

- copy/cut/paste $('html').bind('paste', function(e) {
  e.preventDefault();
  var item = (e.clipboardData || e.originalEvent.clipboardData).items[0];
  var type = item.type.split('/').shift();
  if (type == "image"){
    var file = item.getAsFile();
    var blob = URL.createObjectURL(file); // Blob
    window.open(blob);
  }
});
