
    "use strict";

    var gulp = require("gulp"),
        sass = require("gulp-sass"),
        clean = require("gulp-clean"),
        livereload = require("gulp-livereload"),
        replace = require("gulp-replace"),
        autoprefixer = require("gulp-autoprefixer");


    gulp.task("default", ["html", "img", "sass"], function() {

        console.log("done");

    });


    gulp.task("html", function() {

        var i = /<i data-icon="(.*)"><\/i>/g,
            o = "<svg class=\"$1\"><use xlink:href=\"img/svgdefs.svg#$1\"></use></svg>";

        gulp
            .src(["./app/index.html"])
            .pipe( replace( i, o ) )
            .pipe( gulp.dest("./dist") );

    });

    gulp.task("img", ["clean:img"], function() {

        gulp.src("./app/img/**/*")
            .pipe( gulp.dest("./dist/img") );

    });

    gulp.task("sass", ["clean:sass"], function() {

        return gulp
            .src("./app/css/**/*.scss")
            .pipe( sass().on("error", sass.logError ) )
            .pipe( autoprefixer("last 5 versions") )
            .pipe( gulp.dest("./dist/css") )
            .pipe( livereload() );

    });









    gulp.task("clean:sass", function() {

        return gulp
            .src("./dist/css", { read: false })
            .pipe( clean() );

    });

    gulp.task("clean:img", function() {

        return gulp
            .src("./dist/img", { read: false })
            .pipe( clean() );

    });










    gulp.task("watch:sass", function() {

        livereload.listen();
        gulp.watch("./app/css/**/*.scss", [ "sass" ]);

    });

    gulp.task("watch:html", function() {

        gulp.watch("./app/**/*.html", [ "html" ]);

    });