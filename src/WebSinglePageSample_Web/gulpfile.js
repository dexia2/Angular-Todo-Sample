var gulp = require("gulp");
var typescript = require("gulp-typescript");

gulp.task("ts", function () {

    var options = {
        out: "app.js",
        removeComments: true
    };

    gulp.src([
           "./script/modules/*.ts"
             ])
        .pipe(typescript(options))
        .pipe(gulp.dest("./wwwroot/script"));
});