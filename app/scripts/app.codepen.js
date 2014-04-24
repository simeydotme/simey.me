"use strict";

var app = app || {};



app.codepen = {

    username: "simeydotme",

    pens: [

        "qiInH", // sublime text editor
        "Dtxdu" // google maps static

    ],

    init: function() {

        this.penCache = [];
        this.penLookup = {};

        this.template = $("#codepenTemplate").text();
        this.$codepenList = $(".codepen-list");

        this.getPens(1);

    },

    getPens: function( penPage ) {

        var request = $.ajax({ dataType: "jsonp", jsonp: "jsonp",

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
            pen;

        for (i = 0, len = this.penCache.length; i < len; i++) {
            this.penLookup[this.penCache[i].hash] = this.penCache[i];
        }

        for (i = 0, len = this.pens.length; i < len; i++ ) {

            pen = this.penLookup[ this.pens[ i ] ];
            this.renderPen( pen );

        }

    },

    generateTemplate: function( pen ) {
        
        var html =
            this.template
                .replace("{{title}}", pen.title )
                .replace("{{url}}", pen.url.details )
                .replace("{{hearts}}", pen.hearts )
                .replace("{{views}}", pen.views )
                .replace("{{comments}}", pen.comments );

        return $(html);

    },

    renderPen: function( pen ) {

        var $pen = this.generateTemplate(pen);
        $pen.appendTo( this.$codepenList );

    }




};