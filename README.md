# Javascript Overloaded (beta 1) 

Jo is a JavaScript framework to make the same as pure JS with less code.

## How to use ?
Like every JavaScript library, simply link the JS file into an HTML `<head>` or `<body>` tag.
`<script type="text/javascript src="path/to/jo.js></script>`

Now you can use `Jo` or `$` like that `$("section")` to get the nodes from the DOM.

Then you can use methods like this one `$("section").css("background-color", "#456DA0");`.

## Documentation
http://jordandelcros.github.io/Jo/

## To-do/see
- in node() method, dont remove undesired nodes, just dont get them in found array

- Blob
- WebSQL database -> window.openDatabase()
- geolocation
- offline application
- localStorage SessionStorage

- complex object model
  Object.defineProperty(
    Object.prototype, 
    'renameProperty',
    {
        writable : false, // Cannot alter this property
        enumerable : false, // Will not show up in a for-in loop.
        configurable : false, // Cannot be deleted via the delete operator
        value : function (oldName, newName) {
            // Check for the old property name to 
            // avoid a ReferenceError in strict mode.
            if (this.hasOwnProperty(oldName)) {
                this[newName] = this[oldName];
                delete this[oldName];
            }
            return this;
        }
    }
  );

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
