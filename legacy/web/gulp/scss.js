/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp'),
  sass = require('gulp-sass'),
  changed = require('gulp-changed'),
  notify = require('gulp-notify'),
  csso = require('gulp-csso'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  config = require('./config');

gulp.task('styles', function () {
  return gulp.src(config.scssMain)
    .pipe(changed(config.buildCss))
    .pipe(sass({
      errLogToConsole: true
    }))
    .on('error', notify.onError())
    .pipe(autoprefixer('last 1 version'))
    .pipe(csso())
    .pipe(gulp.dest(config.buildCss))
    .pipe(reload({
      stream: true
    }));
});