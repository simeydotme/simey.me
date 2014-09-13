"use strict";

var app = app || {};


$(function(){

    app.init();

});


app.init = function() {

    app.setup.init();

    app.nav();
    app.header();

    app.window();
    app.background();

};


app.setup = {

    init: function() {

        app.setup.unorphanize();
        app.setup.prettify();
        app.setup.clipboard();

    },

    prettify: function() {

        window.prettyPrint();

    },

    unorphanize: function() {

        $(".kill-orphans").unorphanize();
        $(".blog-link").unorphanize(4);

    },

    clipboard: function() {

        $(".copy-to-clipboard").on("mouseover", function(){

            var range = document.createRange();
            range.selectNodeContents($(this)[0]);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);

        });

    }

};




app.window = function() {

    $(window).on({

        "resize.sections": function() {

            var h = $(window).height();
            $("body").css("padding-bottom", h * 0.5 );

        }

    });

    $(window)
        .trigger("resize.sections")
        .trigger("hashchange");

};




app.background = function() {

    var $body = $("body"),
        bgClasses = $body.data("classes"),
        bgClassArray = bgClasses.split(" ");

    $body.addClass(
        bgClassArray[ Math.floor( Math.random() * bgClassArray.length ) ]
    );

};




app.nav = function() {

    var $items = $(".nav__item"),
        $links = $(".nav__link"),
        activeClass = "active";

    $links.on("activate", function() {

        $items.removeClass( activeClass );
        $(this).closest( $items ).addClass( activeClass );

    });

    $links.on("deactivate", function() {

        $(this).closest( $items ).removeClass( activeClass );

    });

};




app.header = function() {

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

};
