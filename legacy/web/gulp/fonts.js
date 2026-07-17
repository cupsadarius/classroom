/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp-help')(require('gulp')),
  changed = require('gulp-changed'),
  config = require('./config');

/**
 * Add font to distribution
 */
gulp.task('fonts', 'Add fonts to distribution.', function() {
  return gulp.src(config.fonts)
    .pipe(changed(config.buildFonts))
    .pipe(gulp.dest(config.buildFonts));
});
