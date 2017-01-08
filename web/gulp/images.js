/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp-help')(require('gulp')),
  changed = require('gulp-changed'),
  config = require('./config');

/**
 * Add images to distribution
 */
gulp.task('images', 'Add images to distribution.', function() {
  return gulp.src(config.images)
    .pipe(changed(config.buildImages))
    .pipe(gulp.dest(config.buildImages));
});
