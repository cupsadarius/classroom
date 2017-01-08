/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp-help')(require('gulp')),
  less = require('gulp-less'),
  changed = require('gulp-changed'),
  notify = require('gulp-notify'),
  csso = require('gulp-csso'),
  postcss      = require('gulp-postcss'),
  autoprefixer = require('autoprefixer-core'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  config = require('./config');

/**
 * Compile less files into css files and add prefixes to css
 */
gulp.task('less', 'Compile less files into css files and add prefixes to css.', function () {
  var l = less({paths: [config.buildCss]});
  var onError = notify.onError();
  l.on('error', function (e) {
    onError(e);
    l.end();
  });

  return gulp.src(config.lessMain)
    .pipe(changed(config.buildCss))
    .pipe(l).on('error', onError)
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(csso())
    .pipe(gulp.dest(config.buildCss))
    .pipe(reload({
      stream: true
    }));
});
