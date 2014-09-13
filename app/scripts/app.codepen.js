"use strict";

var app = app || {};


$(function(){

    app.codepen.init();

});

app.codepen = {

    username: "simeydotme",
    mobileLimit: 8,
    penCache: [],
    penLookup: [],

    pens: [

        "xpuLs", // Zelda Loading Hearts
        "Dtxdu", // Fagoogly Woogley Maps
        "vKtbC", // Pretty Accessible Radios
        "JmKDi", // CSS Sexy Tabs
        "lthIG", // Checkbox form replacement
        "Gzfuh", // Futuristic Neon Saving
        "gkpjn", // Neon Glowy Loaders
        "wBlvk", // HTML5 Video Player
        "uijad", // Pokeball Loaders
        "elHok", // Sonic + Tails
        "mqjyh", // Reposnive Tabs
        "CFcke", // Chinese Character Strokes
        "JnFGr", // Responsive Side Menu
        "uoBqE", // Particools Canvas
        "hoixz", // CSS Cubes (less mixin)
        "teqLr", // 3d HTC phone animation

    ],

    init: function() {

        this.colors = ["cyan", "mediumpurple", "tomato", "mediumspringgreen"];
        this.color = app.codepen.colors[ Math.floor( Math.random() * this.colors.length ) ];

        this.itemTemplate = $("#codepenTemplate").text();
        this.dataTemplate = $("#codepenTemplateData").text();
        this.$codepenList = $(".codepen-list");

        this.squishList( this.mobileLimit );
        this.getPens( this.pens );
        this.getPenData( 1 );

    },

    squishList: function( length ) {

        if( $(window).width() < 800 ) {
            this.pens = this.pens.slice( 0 , length );
        }

    },

    getPens: function( pens ) {

        var amount = pens.length,
            index;

        for( index = 0; index < amount; index++ ) {

            var request = $.ajax({

                dataType: "jsonp",
                jsonp: "jsonp",
                url: "http://codepen-awesomepi.timpietrusky.com/"+this.username+"/pen/"+pens[index]

            });

            request.success( app.codepen.renderPen );

        }

    },

    getPenData: function( penPage ) {

        var request = $.ajax({

            dataType: "jsonp",
            jsonp: "jsonp",
            url: "http://codepen-awesomepi.timpietrusky.com/" + this.username + "/public/" + penPage

        });

        request.done( function(data) {

            if( data.content !== null ) {

                app.codepen.collatePens( data.content.pens );
                app.codepen.getPenData( penPage + 1 );

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

        // look through our cached pens and create
        // a "lookup" for each one, basically creating an
        // object of each pen, with the "hash" as the objects
        // property, and the pen array as the value

        for( i = 0, len = this.penCache.length; i < len; i++ ) {
            this.penLookup[this.penCache[i].hash] = this.penCache[i];
        }

        // and then look through the lookup for objects that match
        // our array of hashs.

        for( i = 0, len = this.pens.length; i < len; i++ ) {

            hash = this.pens[i];
            pen = this.penLookup[ hash ];

            if( typeof pen !== "undefined" ) {
                this.renderData( pen , i );
            }

        }

    },

    generateItemTemplate: function( pen ) {

        var html =
            this.itemTemplate
                .replace("{{hash}}", pen.hash )
                .replace("{{title}}", pen.title )
                .replace("{{url.details}}", pen.url.details )
                .replace("{{url.pen}}", pen.url.pen );

        return $(html);

    },

    generateDataTemplate: function( pen ) {

        var html =
            this.itemTemplate
                .replace("{{hearts}}", pen.hearts )
                .replace("{{views}}", pen.views )
                .replace("{{comments}}", pen.comments );

        return $(html);

    },

    renderPen: function( pen ) {

        var $item = app.codepen.generateItemTemplate( pen.content.pen ),
            color = Please.make_color({
                base_color: app.codepen.color
            });

        $item.find(".codepen-list__cover").css("background-color", color );

        $item.appendTo( app.codepen.$codepenList );

    },

    renderData: function( pen ) {

        var $data = app.codepen.generateDataTemplate( pen );

        app.codepen.$codepenList
            .find("codepen-list__item--" + pen.hash )
            .find(".codepen-list__cover")
            .append( $data );

    }



};
