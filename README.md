# Javascript overloaded (beta 1) 

Jo is a Javascript library to make the same as pure JS with less code.

## How to use ?
Like every Javascript library, link JS file into HTML head or body end
`<script type="text/javascript src="path/to/Jo.js></script>`

Now you can use `Jo` or `$` like this `$("div:nth-child(1)")` to get nodes.

Then you can use methods like `$("body > section:first-child").css("background-color", "#FF00FF")`.

## Methods

- find
- child
- node
- item
- each
- on
- off
- trigger
- attr
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
