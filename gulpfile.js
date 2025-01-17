// Bring in individual Gulp configurations
require("./config/gulp/flags");
require("./config/gulp/sass");
require("./config/gulp/javascript");
require("./config/gulp/images");
require("./config/gulp/fonts");
require("./config/gulp/license");
require("./config/gulp/build");

var gulp = require("gulp");
var dutil = require("./config/gulp/doc-util");

gulp.task("default", function(done) {
  dutil.logIntroduction();

  dutil.logHelp(
    "gulp",
    "This task will output the currently supported automation tasks. (e.g. This help message.)"
  );

  dutil.logHelp(
    "gulp no-cleanup [ task-name ]",
    "Prefixing tasks with `no-cleanup ` will not remove the distribution directories."
  );

  dutil.logHelp(
    "gulp no-test [ task-name ]",
    "Prefixing tasks with `no-test` will disable testing and linting for all supported tasks."
  );

  dutil.logCommand(
    "gulp clean-dist",
    "This task will remove the distribution directories."
  );

  dutil.logHelp(
    "gulp build",
    "This task is an alias for running `gulp sass javascript images fonts` and is the recommended task to build all assets."
  );

  dutil.logCommand(
    "gulp sass",
    "This task will compile all the Sass files into distribution directories."
  );

  dutil.logCommand(
    "gulp javascript",
    "This task will compile all the JavaScript files into distribution directories."
  );

  dutil.logCommand(
    "gulp images",
    "This task will copy all the image files into distribution directories."
  );

  dutil.logCommand(
    "gulp fonts",
    "This task will copy all the font files into distribution directories."
  );

  done();
});

gulp.task("watch", function() {
  gulp.watch("src/stylesheets/**/*.scss", gulp.series("sass")),
    gulp.watch("src/js/**/*.js", gulp.series("javascript"));
  return;
});
