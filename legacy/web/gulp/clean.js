/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp-help')(require('gulp')),
  del = require('del'),
  config = require('./config');

/**
 * Remove all generated files and folders from vendor
 */
gulp.task('clean', 'Remove all generated files and folders from vendor.', function (cb) {
  del([config.vendor], cb);
});
