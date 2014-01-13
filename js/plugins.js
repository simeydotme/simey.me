(function(){var e;var t=function(){};var n=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"];var r=n.length;var i=window.console=window.console||{};while(r--){e=n[r];if(!i[e]){i[e]=t}}})()




// chainable jquery method for getting pens and appending them.

$.fn.getPens = function( username , options ) {


    var defaults = {

        reverse: false, // show in reverse order
        type: "public",
        minHearts: 5, // show only pens with > 4 hearths
        minViews: 1000, // show only pens with > 999 views.
        maxPens: 4,
        orderBy: "hearts" // (or views or comments or null)

    };

    // if the options wern't an object, we make them an object!
    if( typeof(options) !== "object" ) { 
        options = {}; 
    }

    // then we merge it with the defaults
    options = $.extend( defaults , options );

    $(document).trigger("ajaxStart");


    return $(this).each( function() {


        // some semi-global variables we need.
        var $this = $(this);
        var template = $this.text();
        var limit = 0;


        // we will use a Deffered to append the pens.
        var def = new $.Deferred();


        // when the Deferred is done ...
        // (this appends the pens via an arg (array))
        def.done( function( pens ) {
            
            // sort hte array if we wish!
            if( options.orderBy !== null ) {
                pens.sort(function(a, b) { return a[options.orderBy] - b[options.orderBy]; });
                pens.reverse();
            }
           
            // who wants a reversed set of pens!!?? 
            if( options.reverse ) {
                pens.reverse();
            }

            // for each pen given to us by the argument (array)
            for( pen in pens ) {

                if( limit < options.maxPens ) {

                    // couple of needed vars for the curent array item
                    // and for the template
                    var thisPen = pens[pen];
                    var temp = template;

                    // if this pen has more hearts or more views than
                    // supplied, then we want to show this badboy
                    if( thisPen.hearts >= options.minHearts || 
                        thisPen.views >= options.minViews ) {
                        
                        var handlebars = template.match(/\{\{.*?\}\}/gi);
                        var handlebarsURL = template.match(/\{\{url\..*?\}\}/gi);

                        // replace the urls first as we have to perform a irreversible
                        // damage to the {{}} in the next two for loops

                        for( bar in handlebarsURL ) {
                            var stripbar = handlebarsURL[bar].replace("{{","").replace("}}","").replace("url.","");
                            temp = temp.replace( handlebarsURL[bar] , thisPen["url"][stripbar] );
                        }

                        // if the element is null, dont show null!!!!! meh.

                        for( bar in handlebars ) {
                            var stripbar = handlebars[bar].replace("{{","").replace("}}","");
                            if( thisPen[stripbar] === null ) { thisPen[stripbar] = ""; }
                            temp = temp.replace( handlebars[bar] , thisPen[stripbar] );
                        }

                        // shove this motherlicker on to the webpage!!
                        $this.before( temp );
                        limit++;

                    }                    

                }

            }

        });

        def.fail( function( data ) {

            $this.before("; _ ; <br>Hmmm, looks like the API is down right now. <br>Maybe you can go to <a href=\"http://codepen.io\">codepen.io</a> and check out my pens there.");

        });

        def.always( function() {

            $(document).trigger("ajaxStop");

        });


        // this function is a self-recursing (booya!?) deferred JSON
        // call, because Tim's API doesn't return the number of pages.
        // so we loop through them until we don't get fresh, useful data back!
        // once we've stopped getting good data (ie: an error, or the same page twice)
        // we resolve our deferred!

        var page = 1;

        function getAPage( p ) {
             
            var allPens = [], 
                previousPens, 
                json;

            // firstly, we store the ajax request.

            json = $.ajax({
                url: "http://codepen-awesomepi.timpietrusky.com/"+username+"/"+options.type+"/"+p,
                dataType: 'jsonp',
                jsonp: 'jsonp'
            });

            // and when the ajax request is resolved/done

            json.done( function( data ) {

                var content = data.content;

                // get strings of the page of pens to compare
                var prev = JSON.stringify(previousPens);
                var current;

                if( content !== null ) {

                    current = JSON.stringify(content.pens);

                } else {

                    if( page === 1 ) {

                        def.reject( data );

                    } else {

                        current = prev;

                    }

                }

                // if the content returned is not empty,
                // and the current page of pens pen is not 
                // the same as the last page of pens
                if( current !== prev ) {

                    for( pen in content.pens ) {
                        allPens.push( content.pens[pen] );
                    }

                    previousPens = content.pens;
                    page++;
                    getAPage( page );                

                // if there was no data, we reject the deferred
                // and curse Tim Pietrusky for changing his API :P (haha)
                // } else if( content === null ) {
                //     def.reject( data );
                // otherwise we resolve it! yay!
                } else {

                    def.resolve( allPens );

                }




            });

            json.fail( function( data ) {

                console.log("Damn, the ajax request failed :/");

            });

         }


        getAPage( page );

    });


}
