# jquery-slidein

## Overview

A slide-in panel for jQueryUI that works from all four sides. The panel overlays
your main page and can be slid in on a mouse click or mouse hover. There are lots
of other options for customisation such as grab handle, slide speed, opacity,
peeking-in etc. The plugin is excellent for housing user options which are only for occasional use, especially overlaid onto whole screen UIs that demand the entire screen real estate.

### License

This plugin is available under [the MIT license](https://github.com/pete-rai/jquery-slidein/blob/master/LICENSE). _Please respect the terms of the license._

### Disclaimer

I've done best efforts testing on a range of modern browsers. If you find any problems,
do let me know by raising an issue [here](https://github.com/pete-rai/pete-rai.github.io/issues). Better still, create a fix for the problem too and drop
in the changes; that way everyone can benefit from it.

### Dependencies

This plug relies on [jQuery](https://jquery.com/) (version 2.2.4+) and [jQueryUI](https://jqueryui.com/) (version 1.12.1+)

### Demos and Example Usage

Here are a couple of examples that you can use to understand how the plugin works
and what you can do with it:

* Click [here](https://pete-rai.github.io/jquery-slidein/sample-slidein-basic.html) to see a basic example.
* Click [here](https://pete-rai.github.io/jquery-slidein/sample-slidein-full.html) to see a fuller example, which shows all the options that you can manipulate.

## Example Usage

Here is the simplest example of using the slide-in panel.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>jquery.slidein</title>

    <link rel="stylesheet" type="text/css" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="jquery.slidein.css">

    <script type="text/javascript" src="//code.jquery.com/jquery-2.2.4.min.js"></script>
    <script type="text/javascript" src="//code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script type="text/javascript" src="jquery.slidein.js"></script>
    <script type="text/javascript">

        $(document).ready (function ()  
        {
            $("#mypanel").slidein ({ peek: 12, open: false, speed: 500, opacity: 0.9 });  
        });

    </script>
  </head>
  <body>
    <h1>jquery.slidein</h1>
    <p>This the main page</p>
    <div id="mypanel">This is the panel</div>
  </body>
</html>
```

Important things to note about this example are:

* The jQueryUI CSS is loaded **before** the slide-in CSS
* The jQuery and jQueryUI JavaScript is loaded **before** the slide-in JavaScript
* The slide-in plugin is instantiated **on document.ready**, so that the host element is definitely present
* The desired slide-in options can be set at plugin creation time

### Options

Here are all the slide-in options that you can use to modify appearance and behaviour:

| Option | Values | Default | Description |
| --- | --- | --- | --- |
| breadth | int | 250 | the panel width or height depending on where it is docked |
| curve | int | 10 | the curve of the grab handle edges |
| disabled | bool | false | disable all panel behaviour |
| dock | top, left, bottom, right | left | panel docking edge |
| hidden | bool | false | show or hide the panel and grab handle |
| opacity | float | 1 | panel and grab handle opacity |
| open | bool | true | true is open, false is closed |
| peek | int | 10 | how far the panel "peeks" into the main window |
| position | int | 10 | percentage position of the grab handle, 0 for top, 50 for middle, 100 for bottom |
| prompt | string |  | text to show in the grab handle - no text will show a three-line strip |
| speed | int | 400 | animation speed for opening and closing in millisecs |
| toggle | | | toggles the open and closed state |
| toOpen | click, hover | click | the action that opens the panel |
| toClose | click, hover | click | the action that closes the panel |

Here is an example of how to read and set the plugin options:

```js
var speed = $("#mypanel").slidein ("speed");
$("#mypanel").slidein ("speed", 600);
```

### Styling

You can re-style the slide-in plugin by including custom CSS **after** the main plugin CSS. The CSS classes are:

| Class | Description |
| --- | --- |
| .slidein  | the panel and grab handle |
| .slidein-panel  | the panel only |
| .slidein-handle | the grab handle only |

Here is an example of some custom CSS to set some panel appearance.

```css
.slidein
{
    background : yellow;
}

.slidein-panel
{
    padding : 20px;
}

.slidein-handle
{
    color : navy;
}
```

Note some important points about styling:

* Don't add _width_ or _height_ to the panel, use the 'breadth' widget option instead - as this works for horizontal and vertical docking
* For _right_ or _bottom_ docked panels, you may need to disable the relevant scroll bar using “overflow-x: hidden" or "overflow-y: hidden" on the _html_ selector.

_– [Pete Rai](http://www.rai.org.uk/)_
