/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp-help')(require('gulp')),
  uglify = require('gulp-uglify'),
  config = require('./config');

/**
 * Minify javascript bundle file from distribution
 */
gulp.task('minify', 'Minify javascript bundle file from distribution.', function() {
  return gulp.src(config.buildJs +'/'+ config.bundle)
    .pipe(uglify({
      mangle: true
    }))
    .pipe(gulp.dest(config.buildJs));
});
