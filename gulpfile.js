
"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    clean = require("gulp-clean"),
    livereload = require("gulp-livereload"),
    replace = require("gulp-replace"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify"),
    autoprefixer = require("gulp-autoprefixer");




gulp.task("default", ["clean", "html", "js", "img", "sass"], function() {

    console.log("done");

});








gulp.task("html", function() {

    var i = /<i data-icon="(.*)"><\/i>/g,
        o = "<svg class=\"$1\" role=\"presentation\"><use xlink:href=\"img/svgdefs.svg#$1\"></use></svg>";

    gulp
        .src(["./app/index.html", "./app/favicon.png"])
        .pipe( replace( i, o ) )
        .pipe( gulp.dest("./dist") );

});

gulp.task("js", ["clean:js"], function() {

    var vendor = [
        "./bower_components/svg4everybody/svg4everybody.js",
        "./bower_components/svg4everybody/svg4everybody.ie8.js",
        "./bower_components/jquery/dist/jquery.js",
        "./bower_components/modernizr/modernizr.js" ];

    gulp.src( vendor )
        .pipe( gulp.dest("./dist/js/vendor") )
        .pipe( uglify() )
        .pipe( rename({ extname: ".min.js" }) )
        .pipe( gulp.dest("./dist/js/vendor") );

    gulp.src( "./app/js/**/*.js" )
        .pipe( gulp.dest("./dist/js") )
        .pipe( uglify() )
        .pipe( rename({ extname: ".min.js" }) )
        .pipe( gulp.dest("./dist/js") );

});

gulp.task("sass", ["clean:sass"], function() {

    return gulp
        .src("./app/css/**/*.scss")
        .pipe( sass().on("error", sass.logError ) )
        .pipe( autoprefixer("last 5 versions") )
        .pipe( gulp.dest("./dist/css") )
        .pipe( livereload() );

});

gulp.task("img", ["clean:img"], function() {

    return gulp.src("./app/img/**/*")
        .pipe( gulp.dest("./dist/img") );

});









gulp.task("clean", [

    "clean:sass",
    "clean:js",
    "clean:img"],

    function() {

        console.log("All clean!");

    });

gulp.task("clean:js", function() {

    return gulp
        .src("./dist/js", { read: false })
        .pipe( clean() );

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
