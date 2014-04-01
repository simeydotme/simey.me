(function(){var e;var t=function(){};var n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"];var r=n.length;var i=window.console=window.console||{};while(r--){e=n[r];if(!i[e]){i[e]=t}}})()













$.fn.codepens = function( username , options ) {

  if( typeof(options) !== "object" ) { 
    options = {}; 
  }

  var defaults = {

    type: "public", // "public", "forked", "loved"

    reverse: true, // show highest count first?
    minHearts: 5, // only show pens with minimum 5 hearts
    minViews: 10, // only show pens with minimum 10 views
    minComments: 0, // only show pens with minimum 0 comments

    maxPens: 10, // only show 10 pens total
    orderBy: null, // "views", "hearts", "comments", null
    pageLimit: 2,   // how many codepen pages to include.
                    // currently codepen has 9 pens per page
                    // these pages are ordered by last activity
                    // limiting to <5 will increase load time

    template: "" +
      "<a href=\"{{url.pen}}\" target=\"_blank\" " +
      "title=\"view {{title}} on codepen\">{{title}}</a><br> " +
      "Hearts: {{hearts}} - Views: {{views}}<br> " +
      "{{description}}"

  };

  options = $.extend( defaults , options );

  return this.each( function() {

    var allpens = [];
    var $this = $(this);

    // render() function takes one single pen
    // object (data.content.pens[x]) and renders it
    // by replacing the handlebars in the template.

    var render = function( pen ) {

      var html = options.template;

      // two regex to match normal handlebars templates, 
      // and also "url" templates.

      var handlebars = html.match(/\{\{.*?\}\}/gi);
      var handlebarsURL = html.match(/\{\{url\..*?\}\}/gi);

      // replace the urls first as we have to perform irreversible
      // damage to the {{}} in the next two for loops

      for( bar in handlebarsURL ) {
          var stripbar = handlebarsURL[bar].replace("{{","").replace("}}","").replace("url.","");
          if( typeof( pen["url"][stripbar] ) === "undefined" ) { pen["url"][stripbar] = ""; }
          html = html.replace( handlebarsURL[bar] , pen["url"][stripbar] );
      }

      // don't return "undefineds" for non-defined nodes.

      for( bar in handlebars ) {
          var stripbar = handlebars[bar].replace("{{","").replace("}}","");
          if( typeof( pen[stripbar] ) === "undefined" ) { pen[stripbar] = ""; }
          html = html.replace( handlebars[bar] , pen[stripbar] );
      }

      return html;

    };

    // method for rendering all the pens once collected.
    // this will order, sort and filter by the supplied
    // options.

    var renderAll = function() {

      $(document).trigger("ajaxStop");

      var penCount = 0;

      // sort hte array if we wish!
      if( options.orderBy !== null ) {

          allpens.sort(function(a, b) { return a[options.orderBy] - b[options.orderBy]; });

      }
     
      // who wants a reversed set of pens!!?? 

      if( options.reverse ) {

          allpens.reverse();

      }


      for( pen in allpens ) {

        if( allpens[pen].hearts >= options.minHearts &&
            allpens[pen].views >= options.minViews &&
            allpens[pen].comments >= options.minComments &&
            pen < options.maxPens ) {

              $this.append( render(allpens[pen]) );
              penCount++;

        }


      };

    };

    var getPens = function( page ) {

      page = page || 1;

      $(document).trigger("ajaxStart");

      var request = 
        $.ajax({
          dataType: "jsonp", jsonp: "jsonp",
          url: "http://codepen-awesomepi.timpietrusky.com/"+ username +"/"+options.type+"/"+page
        });

      request.done( function(data) {

        if( data.content !== null ) {

          // add the pens to a larger scoped collection

          for( pen in data.content.pens ) {
            allpens.push( data.content.pens[pen] );
          };

          // if we are allowed more pages, then
          // keep on going! els render the pens.

          if( page < options.pageLimit ) {

            page++;
            getPens( page );

          } else {

            renderAll();

          }

        } else {

          renderAll();

        }

      });

      request.fail( function() {

      });

      request.always( function() {

      });

    };

    getPens();

  });


}







// a small jquery helper function plugin to
// show a random title.
    
$.fn.randomSimey = function( cv ) {
    
    // array of random things to write on
    // my home page.

    var simeys = [
        "eats pizza (without mushrooms)",
        "builds websites",
        "writes jQuery plugins",
        "tries to improve the internet",
        "climbs mountains",
        "plays on the internet",
        "is the hand of the king",
        "sik gong siu siu gwong dung wa",
        "was born in Canada",
        "&hearts;'s Cheezburgers",
        "has flipped a dodgem",
        "makes a mean French Toast",
        "takes photographs",
        "messes with photoshop",
        "drinks as much bubble tea as possible",
        "spam heals in battlegrounds"
    ];
    
    return $(this).each( function( key, element ) {
        
        // if "cv" is true, we only show the
        // name "simon goellner"... more profshunal! lolz.

        if( cv ) { 

            text = "Simon Goellner"; 

        } else {

            // get a random entry in the list.

            var index = 
                Math.floor( Math.random() * simeys.length );
            
            // if the last "simey" we saw, is the same as the
            // random one we just chose, change it!

            if( window.lastSimey === index ) {
                if( window.lastSimey >= simeys.length ) {
                    index = 0;
                } else {
                    index++;
                }
            }
            
            var text = simeys[ index ];
            window.lastSimey = index;

        }


        // handle the "baked in" animations by
        // removing and adding classes.

        $(element)
            .removeClass( "flipInX" )
            .addClass( "animated short fadeOutDown" );

        var sT = setTimeout( function() { 

            $(element).html( text ); 

            $(element)
                .show()
                .removeClass( "fadeOutDown short" )
                .addClass( "flipInX" ); 

        }, 500 );
        
    });

};