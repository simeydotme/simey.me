"use strict";

var app = app || {};



app.flickr = {

    init: function() {

        this.imageCount = 8;
        this.cycleSpeed = 5000;

        this.template = $("#flickrTemplate").text();
        this.$photobox = $(".photo-box");

        this.imageCollection = [];

        // please don't use my API key in your projects, it'll slow down
        // your website as well as mine. Please get your own from 
        // https://www.flickr.com/services/apps/create/
        // it's totally free :)

        this.apiKey = "dd8e97ef9c1283583dcaf92b9ba80170";
        this.photoset = "72157634483069405";
        this.collectionURL =
            "http://api.flickr.com/services/rest/"+
                "?format=json&jsoncallback="+
                    "?&method=flickr.photosets.getPhotos&api_key="+this.apiKey+"&photoset_id="+this.photoset;


        this.getCollection( this.collectionURL );
        

    },

    getCollection: function( collectionURL ) {

        $.getJSON( collectionURL )

            .done( function(data) {

                app.flickr.imageCollection = data.photoset.photo.reverse();
                app.flickr.initPhotos();

            });


    },

    generateTemplate: function( photo ) {

        var src = "http://farm"+photo.farm+".staticflickr.com/"+photo.server+"/"+photo.id+"_"+photo.secret+"_z.jpg";
        
        var html =
            this.template
                .replace("{{title}}", photo.title._content )
                .replace("{{alt}}", photo.title._content )
                .replace("{{url}}", photo.urls.url[0]._content )
                .replace("{{src}}", src );

        var $html = $(html);

        $html
            .find(".photo-box__link")
            .css("background-image", "url("+src+")" )
            .end()
            .find(".photo-box__photo")
            .hide();

        return $html;

    },

    getPhoto: function( number ) {

        var photoID = app.flickr.imageCollection[number].id;

        var photoURL =
            "http://api.flickr.com/services/rest/"+
                "?format=json&jsoncallback="+
                    "?&method=flickr.photos.getInfo&api_key="+this.apiKey+"&photo_id="+photoID;

        return $.getJSON( photoURL );

    },

    renderPhoto: function( photo ) {

        photo.done( function( data ) {

            var $html = app.flickr.generateTemplate( data.photo );
            $html.appendTo( app.flickr.$photobox );

            app.flickr.showPhoto( $html );

        });

    },

    initPhotos: function() {

        for( var i = 0; i < this.imageCount; i++ ) {
            this.renderPhoto( this.getPhoto( i ));
        }

    },

    showPhoto: function( $photo ) {

        setTimeout( function() {

            $photo.addClass("show");

        },200);

    }

};