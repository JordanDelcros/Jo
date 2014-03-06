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
```

### css( name, value )
Set or get styles.
Return Jo object or string containg style value or object containing styles values.
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

### is( selector )
Compare nodes found in Jo.found array to the CSS selector. Return true if all nodes match or false if only one fail.
Return boolean.
- **selector _[string]_** is the selector to compare with.
```js
  var divs = $("section div");

  if( divs.is("div[data-type^='elements'][draggable]:nth-of-type(1)") ){

    divs.css("border", "1px solid green");

  };
```

### insertBefore( html )
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
Instantiate XMLHTTPRequest

### socket( settings )

### worker( settings )
#### send
#### receive / on
#### terminate

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