"use strict";

var app = {

    init: function() {

        app.setup.unorphanize();
        app.setup.prettify();
        app.setup.waypoints();

        app.nav();
        app.header();
        app.about();
        app.github();

        app.window();
        app.background();

    },

    setup: {

        prettify: function() {
            window.prettyPrint();
        },

        unorphanize: function() {
            $(".kill-orphans").unorphanize();
        },

        waypoints: function() {

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
                    window.location.hash = "";
                }
            });

        }

    },

    helpers: {

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

    },

    window: function() {

        $(window).on({

            "resize.sections": function() {

                var h = $(window).height();

                $(".header").height( h );
                $("section").css("min-height", h * 0.75 );
                $("body").css("padding-bottom", h * 0.5 );

            },

            "hashchange.scrolly": function(e) {

                if( new RegExp("#_github\/").test( window.location.hash ) ) {

                    $(window).trigger("sublimetab", window.location.hash );

                } else {

                    app.helpers.smoothScroll( e , window.location.hash );

                }

            }

        });

        $(window)
            .trigger("resize.sections")
            .trigger("hashchange.scrolly");

        if( new RegExp("#_github\/").test( window.location.hash ) ) {

            $(window).scrollTop( $("#_github").offset().top + 20 );

        }

    },

    background: function() {

        var $body = $("body"),
            bgClasses = $body.data("classes"),
            bgClassArray = bgClasses.split(" ");

        setTimeout(function(){
            $body.addClass( bgClassArray[ Math.floor( Math.random() * bgClassArray.length ) ] );
        }, 2500 );

    },

    nav: function() {

        var $items = $(".nav__item"),
            $links = $(".nav__link"),
            activeClass = "active";

        $links.on("click", function(e) {

            var $this = $(this),
                target = $this.attr("href");

            app.helpers.smoothScroll( e , target );

        });

        $links.on("activate", function() {

            $items.removeClass( activeClass );
            $(this).closest( $items ).addClass( activeClass );

        });

        $links.on("deactivate", function() {

            $(this).closest( $items ).removeClass( activeClass );

        });

    },

    header: function() {

        var $headerDev = $(".header-dev"),
            openClass = "header-dev--open",
            slowClass = "header-dev--slow";

        setTimeout(function(){

            $headerDev
                .addClass( slowClass )
                .removeClass( openClass );

            setTimeout(function(){

                $headerDev.removeClass( slowClass );

            }, 1500 );

        }, 1000 );

        $headerDev.on("click", function() {
            $headerDev.trigger("playAnimation");
        });

        $headerDev.on("playAnimation", function() {

            $headerDev.toggleClass( openClass );

        });


    },

    about: function() {


    },

    github: function() {

        var activeClass = "active",
            $tabs = $(".sublime-tabs__tab"),
            $links = $(".sublime-tabs__link"),
            $projects = $(".sublime-project"),
            $footer = $(".sublime__footer"),
            $title = $(".sublime__title"),
            titleText = $title.text();

        $(window).on("sublimetab", function(e,href) {

            var $link = $links.filter("[href=" +href.replace("/","\\/")+ "]"),
                $tab = $link.closest(".sublime-tabs__tab");

            $tab.trigger("activateTab",href);

        });

        $tabs.on("activateTab", function(e,href) {

            href = href.split("/");

            var $tab = $(this),
                $project = $projects.filter("[data-project-name="+ href[href.length-1] +"]");

            $tabs.removeClass( activeClass );
            $tab.addClass( activeClass );
            $projects.removeClass( activeClass );
            $project.addClass( activeClass );

            $title.text( $tab.children(".sublime-tabs__link").text() + " - " + titleText);
            $footer.text( $tab.children(".sublime-tabs__link").data("type") );

        });

        $tabs.first().trigger("activateTab", $links.first().attr("href") );

    }

};





$(function(){

    app.init();

});

