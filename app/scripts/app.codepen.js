"use strict";

var app = app || {};



app.codepen = {

    username: "simeydotme",

    pens: [

        "http://codepen.io/simeydotme/pen/xpuLs", // Zelda Loading Hearts
        "http://codepen.io/simeydotme/pen/Dtxdu", // Fagoogly Woogley Maps
        "http://codepen.io/simeydotme/pen/vKtbC", // Pretty Accessible Radios
        "http://codepen.io/simeydotme/pen/JmKDi", // CSS Sexy Tabs
        "http://codepen.io/simeydotme/pen/lthIG", // Checkbox form replacement
        "http://codepen.io/simeydotme/pen/Gzfuh", // Futuristic Neon Saving
        "http://codepen.io/simeydotme/pen/gkpjn", // Neon Glowy Loaders
        "http://codepen.io/simeydotme/pen/wBlvk", // HTML5 Video Player
        "http://codepen.io/simeydotme/pen/uijad", // Pokeball Loaders
        "http://codepen.io/simeydotme/pen/elHok", // Sonic + Tails
        "http://codepen.io/simeydotme/pen/mqjyh", // Reposnive Tabs
        "http://codepen.io/simeydotme/pen/CFcke", // Chinese Character Strokes
        "http://codepen.io/simeydotme/pen/JnFGr", // Responsive Side Menu
        "http://codepen.io/simeydotme/pen/uoBqE", // Particools Canvas
        "http://codepen.io/simeydotme/pen/hoixz", // CSS Cubes (less mixin)
        "http://codepen.io/simeydotme/pen/teqLr", // 3d HTC phone animation

    ],

    init: function() {

        this.penCache = [];
        this.penLookup = {};

        this.template = $("#codepenTemplate").text();
        this.$codepenList = $(".codepen-list");

        app.helpers.checkCacheTTL( "codepen" , 48 );
        this.getPens(1);

    },

    getPens: function( penPage ) {

        var request = $.memoizedAjax({

            dataType: "jsonp",
            jsonp: "jsonp",
            localStorage: true,
            cacheKey: "codepen",
            url: "http://codepen-awesomepi.timpietrusky.com/"+this.username+"/public/"+penPage

        });

        request.done( function(data) {

            if( data.content !== null ) {

                app.codepen.collatePens( data.content.pens );
                app.codepen.getPens( penPage+1 );

            } else {

                app.codepen.filterPens();

            }

        });

    },

    collatePens: function( pensArray ) {

        for( var i = 0, len = pensArray.length; i < len; i++ ) {
            
            this.penCache[ this.penCache.length ] = pensArray[i];

        }

    },

    filterPens: function() {

        var i = 0,
            len = 0,
            pen,
            hash;

        // look throught our cached pens and create
        // a "lookup" for each one, basically creating an
        // object of each pen, with the "hash" as the objects
        // property, and the pen array as the value
        
        for( i = 0, len = this.penCache.length; i < len; i++ ) {

            this.penLookup[this.penCache[i].hash] = this.penCache[i];

        }

        // and then look through the lookup for objects that match
        // our array of hashs. 

        for( i = 0, len = this.pens.length; i < len; i++ ) {

            hash = this.pens[i].slice( this.pens[i].lastIndexOf("/")+1 , this.pens[i].length );
            pen = this.penLookup[ hash ];

            if( typeof(pen) !== "undefined" ) {
                this.renderPen( pen , i );
            }

        }

    },

    generateTemplate: function( pen ) {
        
        var html =
            this.template
                .replace("{{title}}", pen.title )
                .replace("{{url.details}}", pen.url.details )
                .replace("{{url.pen}}", pen.url.pen )
                .replace("{{hearts}}", pen.hearts )
                .replace("{{views}}", pen.views )
                .replace("{{comments}}", pen.comments );

        return $(html);

    },

    renderPen: function( pen , listNumber ) {

        var $pen,
            timer,
            gap = 100;

        $pen = this.generateTemplate(pen).appendTo( this.$codepenList );

        timer = setTimeout(function() {

            $pen.removeClass("hidden");

        }, gap*listNumber );

    }



};