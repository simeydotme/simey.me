"use strict";

var app = {

    init: function() {

        this.mainEvents();
        this.simeyHeader();
        this.prettify();
        this.github();

    },

    prettify: function() {

        window.prettyPrint();

    },

    mainEvents: function() {

        $(window).on({

            "resize.header": function() {

                var h = $(window).height();

                $(".header").height( h );
                $("section").css("min-height", h * 0.75 );
                $("body").css("padding-bottom", h * 0.5 );

            }

        }).trigger("resize.header");


        $(".header__dev").on({

            "click.header": function() {

                $(".header__dev").toggleClass("header__dev--open");

            }

        });

    },

    simeyHeader: function() {

        setTimeout( function() {
            $(".header__dev").addClass("header__dev--slow").removeClass("header__dev--open");
        },1000);


        setTimeout( function() {
            $(".header__dev").removeClass("header__dev--slow");
        },2400);


    },

    github: function() {

        var $links = $(".sublime-window a");

        $links.on("click", function(e) {

            e.preventDefault();

            $links.closest("li").removeClass("active");
            $(this).closest("li").addClass("active");

            showPre();

        });

        function showPre() {

            var $link = $links.closest("li").filter(".active").children("a");
            var id = $link.attr("href");

            $(".sublime-window pre").fadeOut( 200, function() {
                $(id).fadeIn(200);
            });

            $(".sublime-title").text( $link.text() );
            $(".sublime-footer").text( $link.data("type") );

        }
            
        showPre();

    }

};





$(function(){

    app.init();

});

