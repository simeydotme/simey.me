   
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