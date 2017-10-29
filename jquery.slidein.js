/*
 * jQuery Slidein Plugin v1.0.1
 * https://github.com/pete-rai/jquery-slidein
 *
 * Copyright 2017 Pete Rai
 * Released under the MIT license
 * https://github.com/pete-rai/jquery-slidein/blob/master/LICENSE
 *
 * Released with the karmaware tag
 * https://pete-rai.github.io/karmaware
 *
 * Website  : http://www.rai.org.uk
 * GitHub   : https://github.com/pete-rai
 * LinkedIn : https://uk.linkedin.com/in/raipete
 *
 */

'use strict';

// a simple jquery widget for an overlay panel that slides in and out from any dock
// *** remember to include the corresponding CSS file ***

$.widget( ".slidein", {

    _valid_docks: ["left", "top", "right", "bottom"],  // first one is the default
    _valid_actions: ["click", "hover"],  // first one is default
    _class_common: "slidein",            // class for all elements
    _class_panel: "slidein-panel",       // class for main panel
    _class_handle: "slidein-handle",     // class for grab handle
    _grab_handle: null,                  // created handle element will go here
    _default_handle: "&#9776;",          // default text for the grab handle
    _mouse_in: null,                     // used to sync mouse in events
    _mouse_out: null,                    // used to sync mouse out events
    _mouse_delay: 25,                    // delay before mouse in / out event processing
    _sliding: false,                     // set to true *during* the slide animations

    options: {
        breadth: 250,       // panel width or height depending on where its docked
        curve:10,           // the curve of the handle
        disabled:false,     // panel shuts and won't open any more
        dock: "left",       // default to left
        hidden:false,       // panel and grab handle is hidden
        opacity: 1,         // slide in panel opacity
        open: true,         // true is open, false is closed
        peek: 10,           // how far the panel peeks into the main window
        position:10,        // percentage position of the handle, 0 = top, 50 = middle, 100 = bottom
        prompt: "",         // text to show in the grab handle
        speed: 400,         // animate speed for opening and closing in millisecs
        toOpen: "click",    // what actions open the panel
        toClose: "click"    // what actions close the panel
    },

    // one time control initialisation

    _create: function () {

        this.element
            .addClass( this._class_common )
            .addClass( this._class_panel );

        this._grab_handle = $( "<span></span>" )
            .addClass( this._class_common )
            .addClass( this._class_handle )
            .insertAfter( this.element );

        var self = this;

        this._grab_handle.click( function (e) {
            self.toggle();
        });

        this.element.mouseleave( function() {
            if ( self.options.toClose == "hover" && !this._sliding) {
                self._mouse_out = setTimeout( function () { self.open ( false ) }, this._mouse_delay );
            }
            clearTimeout( self._mouse_in );
        }).mouseenter( function() {
            if ( self.options.toOpen == "hover" && !this._sliding) {
        //   ** have to hover over grab handle only to open - else it can go slide-in-out mental **
        //        self._mouse_in = setTimeout( function () { self.open ( true ) }, this._mouse_delay );
            }
            clearTimeout( self._mouse_out );
        });

        this._grab_handle.mouseleave( function() {
            if ( self.options.toClose == "hover" && !this._sliding) {
                self._mouse_out = setTimeout( function () { self.open ( false ) }, this._mouse_delay );
            }
            clearTimeout( self._mouse_in );
        }).mouseenter( function() {
            if ( self.options.toOpen == "hover" && !this._sliding) {
                self._mouse_in = setTimeout( function () { self.open ( true ) }, this._mouse_delay );
            }
            clearTimeout( self._mouse_out );
        });

        this._setOptions({
            "breadth": this.options.breadth,
            "curve": this.options.curve,
            "disabled": this.options.disabled,
            "dock": this.options.dock,
            "hidden": this.options.hidden,
            "opacity": this.options.opacity,
            "open": this.options.open,
            "peek": this.options.peek,
            "position": this.options.position,
            "prompt": this.options.prompt,
            "speed": this.options.speed,
            "toOpen": this.options.toOpen,
            "toClose": this.options.toClose
        });

        $(window).resize ( function () {
            self.refresh();  // call refresh on window changes
        });
    },

    // destructor called on element deletion

    _destroy: function () {

        this.element
            .removeClass( this._class_common )
            .removeClass( this._class_panel );

        if ( this._grab_handle !== null ) {
             this._grab_handle.remove();
        }
    },

    // set the control options

    _setOption: function ( key, value ) {

        var self = this;

        var handlers = {
            "breadth": function () { self.breadth( value ); },
            "curve": function () { self.curve( value ); },
            "disabled": function () { self.disabled( value ); },
            "dock": function () { self.dock( value ); },
            "hidden": function () { self.hidden( value ); },
            "opacity": function () { self.opacity( value ); },
            "open": function () { self.open( value ); },
            "peek": function () { self.peek( value ); },
            "position": function () { self.position( value ); },
            "prompt": function () { self.prompt( value ); },
            "speed": function () { self.speed( value ); },
            "toOpen": function () { self.toOpen( value ); },
            "toClose": function () { self.toClose( value ); }
        };

        if ( key in handlers ) {
            handlers[key]();
        }

        this._super( key, value ); // base handler
    },

    // repositions the panel in the light of css or other visual changes

    refresh: function () {

        this._reposition();
    },

    // toggles the open option

    toggle: function () {

        this.open( !this.options.open );
    },

    // sets the width or height depending on where its docked

    breadth: function ( breadth ) {

        if ( breadth === undefined ) {
            return this.options.breadth;
        }

        this.options.breadth = this._valid_integer ( breadth );
        this._reposition();
    },

    // sets curve of the handle

    curve: function ( curve ) {

        if ( curve === undefined ) {
            return this.options.curve;
        }

        this.options.curve = this._valid_integer ( curve );
        this._reposition();
    },

    // sets the disabled option, stops open / close (frozen in current state)

    disabled: function ( disabled ) {

        if ( disabled === undefined ) {
            return this.options.disabled;
        }

        this.options.disabled = this._valid_boolean( disabled );  // will be applied on next call to open / close
    },

    // sets the dock option and repositions

    dock: function ( dock ) {

        if ( dock === undefined ) {
            return this.options.dock;
        }

        this.options.dock = this._valid_enum( this._valid_docks, dock );
        this._reposition();
    },

    // sets the hidden option

    hidden: function ( hidden ) {

        if ( hidden === undefined ) {
            return this.options.hidden;
        }

        this.options.hidden = this._valid_boolean( hidden );
        this.options.hidden ? this.element.hide() : this.element.show();
        this.options.hidden ? this._grab_handle.hide() : this._grab_handle.show();
    },

    // sets the panel opacity

    opacity: function ( opacity ) {

        if ( opacity === undefined ) {
            return this.options.opacity;
        }

        this.options.opacity = this._valid_float( opacity );
        this._reposition();
    },

    // sets the open / close option and repositions

    open: function ( open ) {

        if ( open === undefined ) {
            return this.options.open;
        }

        if ( this.options.disabled ) {  // can't open / close a disabled panel (freeze in current state)

            this._trigger( "slide", null, { open: this.options.open, dock: this.options.dock } );  // we still trigger to any we didn't slide

        } else {

            open = this._valid_boolean( open );

            if ( this.options.open != open ) {

                this.options.open = open;
                this._sliding     = true;

                var amount = this._is_horizontal() ? this.element.outerWidth() : this.element.outerHeight();
                var move   = ( open ? "+=" : "-=" ) + ( amount - this.options.peek );
                var self   = this;
                var prop   = {};

                prop [this.options.dock] = move;

                $( this._grab_handle ).animate( prop, this.options.speed , "linear" );

                $( this.element ).animate( prop, this.options.speed, "linear", function() {
                    self._sliding = false;
                    self._trigger( "slide", null, { open: self.options.open, dock: self.options.dock } );  // trigger to any "we slid" handlers
                });
            }
        }
    },

    // sets the peek option and repositions

    peek: function ( peek ) {

        if ( peek === undefined ) {
            return this.options.peek;
        }

        this.options.peek = this._valid_integer( peek );
        this._reposition();
    },

    // sets the percentage position of the handle, 0 = top, 50 = middle, 100 = bottom and repositions

    position: function ( position ) {

        if ( position === undefined ) {
            return this.options.position;
        }

        this.options.position = Math.max( 0, Math.min( 100, this._valid_integer( position )));
        this._reposition();
    },

    // sets the prompt option and repositions

    prompt: function ( prompt ) {

        if ( prompt === undefined ) {
            return this.options.prompt;
        }

        this.options.prompt = prompt;
        this._reposition();
    },

    // sets the speed option, applied on next call to open / close

    speed: function ( speed ) {

        if ( speed === undefined ) {
            return this.options.speed;
        }

        this.options.speed = this._valid_integer( speed );
    },

    // sets the action needed to open the panel

    toOpen: function ( toOpen ) {

        if ( toOpen === undefined ) {
            return this.options.toOpen;
        }

        this.options.toOpen = this._valid_enum( this._valid_actions, toOpen );
    },

    // sets the action needed to close the panel

    toClose: function ( toClose ) {

        if ( toClose === undefined ) {
            return this.options.toClose;
        }

        this.options.toClose = this._valid_enum( this._valid_actions, toClose );
    },

    // returns whether in horizontal or vertical axis

    _is_horizontal: function () {

        return this.options.dock == "left" || this.options.dock == "right";
    },

    _reposition: function () {

        this._grab_handle.html( this.options.prompt ? this.options.prompt : this._default_handle );  // set text before we measure dimensions below

        // start with a clean slate
        this.element.css ( "width", "" );
        this.element.css ( "height", "" );

        this.element.css ( "left", "" );
        this.element.css ( "top", "" );
        this.element.css ( "right", "" );
        this.element.css ( "bottom", "" );
        this.element.css ( "opacity", this.options.opacity );

        this._grab_handle.css ( "left", "" );
        this._grab_handle.css ( "top", "" );
        this._grab_handle.css ( "right", "" );
        this._grab_handle.css ( "bottom", "" );
        this._grab_handle.css ( "opacity", this.options.opacity );

        var size_main;  // the axis we are docked on
        var size_other;  // the axis perpendicular to the main axis
        var size_handle;  // size of the handle in the axis being used
        var anchor_handle;  // where we anchor handle positions
        var stop_handle;  // stop point for the  handle in the axis being used

        // curve points for the handle corners

        var radius_tl = 0;  // top-left
        var radius_tr = 0;  // top-right
        var radius_bl = 0;  // bottom-left
        var radius_br = 0;  // bottom-right

        // set the size and the main dock points
        if ( this._is_horizontal() ) {
            this.element.css ( "width", this.options.breadth );
            this.element.css( "top", "0" );
            this.element.css( "bottom", "0" );

            size_main = this.element.outerWidth();
            size_other = this.element.outerHeight();
            size_handle = this._grab_handle.outerHeight();
            stop_handle = this.element.position().top;
            anchor_handle = "top";

            if ( this.options.dock == "left" ) {
                radius_tr = this.options.curve;
                radius_br = this.options.curve;
            } else {  // right
                radius_tl = this.options.curve;
                radius_bl = this.options.curve;
            }
        }
        else {
            this.element.css ( "height", this.options.breadth );
            this.element.css( "left", "0" );
            this.element.css( "right", "0" );

            size_main = this.element.outerHeight();
            size_other = this.element.outerWidth();
            size_handle = this._grab_handle.outerWidth();
            stop_handle = this.element.position().left;
            anchor_handle = "left";

            if ( this.options.dock == "top" ) {
                radius_bl = this.options.curve;
                radius_br = this.options.curve;
            } else {  // bottom
                radius_tl = this.options.curve;
                radius_tr = this.options.curve;
            }
        }

        // set open / close state
        this.element.css( this.options.dock, this.options.open ? 0 : -1 * ( size_main - this.options.peek ) );

        // set handle position in main axis
        this._grab_handle.css( this.options.dock, this.options.open ? size_main : this.options.peek );

        // put handle in right place in perpendicular axis (never off screen or overlapping)
        var pos_handle = ( size_other / 100 * this.options.position ) - ( size_handle / 2 ) + stop_handle;
        pos_handle = Math.max( pos_handle, stop_handle );
        pos_handle = Math.min( pos_handle, size_other - size_handle + stop_handle );
        this._grab_handle.css( anchor_handle, pos_handle );
        this._grab_handle.css( "border-radius", radius_tl + "px " + radius_tr + "px " + radius_br + "px " + radius_bl + "px" );
    },

    // checks for a valid boolean, false for bad input

    _valid_boolean: function ( boolean ) {

        // if certain values are passed in as string type, we might still
        // treat them as false (as all strings are true by default

        if ( jQuery.type( boolean ) === "string" ) {

            if ( $.inArray( boolean.trim().toLowerCase(), ["0", "false", "no"] ) !== -1 ) {
                boolean = false;
            }
        }

        return boolean ? true : false;  // convert to a definite boolean
    },

    // converts to a valid integer, zero for bad input

    _valid_integer: function ( integer ) {

        return ( isNaN( parseInt( integer ))) ? 0 : integer;
    },

    // converts to a valid float, zero for bad input

    _valid_float: function ( float ) {

        return ( isNaN( parseFloat( float ))) ? 0 : float;
    },

    // checks for a valid enumeration, first item returned for bad input

    _valid_enum: function ( values, value ) {

        if ( jQuery.type( value ) !== "string" ) {  // converge to strings
            value = "";
        }

        value = value.trim().toLowerCase();

        if ( $.inArray( value, values ) == -1 ) {
            value = values[0];  // first item wil be the default
        }

        return value;
    }
});
