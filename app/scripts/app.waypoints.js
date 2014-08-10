"use strict";

var app = app || {};



app.waypoints = function() {

    $(".js-flickr-waypoint").waypoint({

        offset: 400,
        triggerOnce: true,
        handler: function() {

            app.flickr.init();

        }

    });


    $(".js-codepen-waypoint").waypoint({

        offset: 600,
        triggerOnce: true,
        handler: function() {

            app.codepen.init();

        }

    });

};
