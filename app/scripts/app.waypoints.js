"use strict";

var app = app || {};



app.waypoints = function() {




    $(".js-nav-waypoint").waypoint({

        offset: function() {
            return $(".nav__list").outerHeight();
        },
        handler: function() {
            $(".nav__link").filter("[href=#" +this.id+ "]").trigger("activate");
        }
        
    });





    $(".js-nav-header-waypoint").waypoint({

        offset: -10,
        handler: function() {
            $(".nav__link").trigger("deactivate");
        }

    });




    $(".js-flickr-waypoint").waypoint({

        offset: 100,
        triggerOnce: true,
        handler: function() {
            
            app.flickr.init();

        }

    });





};