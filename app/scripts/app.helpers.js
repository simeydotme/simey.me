"use strict";

var app = app || {};



app.helpers = {




    getTransitionSpeed: function( $el , returnArray ) {

        var speed = $el.css("transition-duration").split(","),
            speedLength = speed.length;

        for( var i = 0; i < speedLength; i++) {

            var multiplier = 1000;

            speed[i] =
                speed[i]
                    .replace(" ","")
                    .replace("s","");

            speed[i] = parseFloat( speed[i] ) * multiplier;

        }

        if( returnArray ) {
            return speed;
        } else {
            return Math.max.apply(Math, speed);
        }

    },




    smoothScroll: function( event, hash , noHashUpdate ) {

        event.preventDefault();

        var to = 0,
            $doc = $(document),
            $window = $(window),
            $nav = $("nav"),
            $el = $(hash);

        if( $el.exists() ) {

            if ($el.offset().top > ($doc.height() - $window.height())) {
                to = $doc.height() - $window.height();
            } else {
                to = $el.offset().top - $nav.outerHeight();
            }

            if( to <= $window.scrollTop() ) {
                to -= 10;
            } else {
                to += 10;
            }

        }
        
        $("html,body")
            .stop()
            .animate({ scrollTop: to }, 300, function() {
                if(!noHashUpdate) {
                    window.location.hash = hash;
                }
            });

    }

};