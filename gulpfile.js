const gulp = require("gulp");

(function(){
  const connect = require("gulp-connect");
  const port = "8888";
  const root = ".";
  const livereload = true;

  gulp.task("serve", () => {
    connect.server({
      root: root,
      port: port,
      livereload: livereload
    });
  });
})();

(function(){
  gulp.task("sri", () => {
  });
})();
