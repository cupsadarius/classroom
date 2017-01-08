'use strict'; //eslint-disable-line strict

let gulp = require('gulp');
let browserify = require('browserify');
let watchify = require('watchify');
let notify = require('gulp-notify');
let source = require('vinyl-source-stream');
let browserSync = require('browser-sync');
let reload = browserSync.reload;
let babelify = require('babelify');
let config = require('./config');
let resolutions = require('browserify-resolutions');
let livereactload = require('livereactload');

gulp.task('watchify', () => {
  let browserifyConfig = Object.assign({}, watchify.args, { debug: true, plugin: [livereactload] });

  let bundler = watchify(browserify(config.jsMain, browserifyConfig), {poll:100});

  function rebundle() {
    return bundler
      .bundle()
      .on('error', notify.onError())
      .pipe(source(config.bundle))
      .pipe(gulp.dest(config.buildJs))
      .pipe(reload({
        stream: true,
      }));
  }

  bundler
    .plugin(resolutions, ['react'])
    .transform(babelify)
    .on('update', rebundle);
  return rebundle();
});
