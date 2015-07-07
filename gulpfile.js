
    "use strict";

    var gulp = require("gulp"),
        sass = require("gulp-sass"),
        clean = require("gulp-clean");


    gulp.task("default", ["copy:html", "clean:sass", "sass"], function() {

        console.log("done");

    });


    gulp.task("copy:html", function() {

        gulp
            .src("./app/index.html")
            .pipe( gulp.dest("./dist") );

    });

    gulp.task("clean:sass", function() {

        return gulp
            .src("./dist/css", { read: false })
            .pipe( clean() );

    });

    gulp.task("sass", function() {

        gulp
            .src("./app/css/**/*.scss")
            .pipe( sass().on("error", sass.logError ))
            .pipe( gulp.dest("./dist/css") );

    });

    gulp.task("watch:sass", function() {

        gulp.watch("./app/css/**/*.scss", [ "clean:sass", "sass" ]);

    });
