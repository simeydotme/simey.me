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
                $("#header").height( $(window).height() );
                $("body").css("padding-bottom", $(window).height()/2 );
            }

        }).trigger("resize");


        $(".header-simey, .header-dev").on({

            "click.header": function() {
                $(".header-simey i, .header-dev").toggleClass("shift");
            }

        });

    },

    simeyHeader: function() {

        var $h1 = $("h1");
        var text = $h1.text();
        var letters = text.length;

        $h1.empty();

        for(var i = 0; i < letters; i++) {

            var $letter =
                $("<i>")
                    .text( text[i] )
                    .addClass( "letter-" + text[i] + " shift" )
                    .css( "z-index", letters - i );
            
            $h1.append( $letter );

        }

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

            var id = $links.closest("li").filter(".active").children("a").attr("href");

            $(".sublime-window pre").fadeOut( 200, function() {
                $(id).fadeIn(200);
            });

        }
            
        showPre();

    }

};





$(function(){

    app.init();

});

