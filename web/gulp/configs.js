/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp-help')(require('gulp')),
  changed = require('gulp-changed'),
  config = require('./config');

/**
 * Add config files to distribution
 */
gulp.task('configs', 'Add config files to distribution.', function() {
  return gulp.src(config.configs)
    .pipe(changed(config.buildConfigs))
    .pipe(gulp.dest(config.buildConfigs));
});
