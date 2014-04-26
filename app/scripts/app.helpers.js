"use strict";

var app = app || {};



app.helpers = {




    getTransitionSpeed: function($el, returnArray) {

        var speed = $el.css("transition-duration").split(","),
            speedLength = speed.length;

        for (var i = 0; i < speedLength; i++) {

            var multiplier = 1000;

            speed[i] =
                speed[i]
                .replace(" ", "")
                .replace("s", "");

            speed[i] = parseFloat(speed[i]) * multiplier;

        }

        if (returnArray) {
            return speed;
        } else {
            return Math.max.apply(Math, speed);
        }

    },



    checkCacheTTL: function( cacheKey , TTL ) {

        var currentDate = new Date().getTime(),
            cacheDate,
            dateDifference,
            createTTL = false;

        if ( localStorage.getItem(cacheKey) !== null ) {

            cacheDate = new Date( localStorage.getItem(cacheKey) ).getTime();
            dateDifference = ( currentDate - cacheDate ) /1000/60/60;

            if ( dateDifference > TTL ) {

                app.helpers.removeLocaleStorage( cacheKey );
                createTTL = true;

            }

        } else {

            createTTL = true;

        }

        if( createTTL ) {

            this.setCacheTTL( cacheKey );

        }

    },

    setCacheTTL: function( cacheKey ) {

        localStorage.setItem( cacheKey , new Date() );

    },

    removeLocaleStorage: function(startsWith) {

        var myLength = startsWith.length;

        Object.keys(localStorage)
            .forEach(function(key) {
                if (key.substring(0, myLength) === startsWith) {
                    localStorage.removeItem(key);
                }
            });

    }

};
