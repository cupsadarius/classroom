/*eslint strict: [2, "global"], prefer-arrow-callback: 0, no-var: 0 */
'use strict';

let gulp = require('gulp-help')(require('gulp'));
let config = require('./gulp/config');
let runSequence = require('run-sequence');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');

require('./gulp/clean');
require('./gulp/images');
require('./gulp/fonts');
require('./gulp/configs');
require('./gulp/less');
require('gulp-notify');
require('./gulp/browserify');
require('./gulp/watchify');
require('./gulp/minify');
require('./gulp/html');
require('./gulp/revision');

/**
 * Watch less, html, images, fonts, translations and rebuild them
 */
gulp.task('watchTask', 'Watch less, html, images, fonts, and rebuild them', function() {
  gulp.watch(config.lessFiles, ['less']);
  gulp.watch(config.htmlFiles, ['html']);
  gulp.watch(config.images, ['images']);
  gulp.watch(config.fonts, ['fonts']);
});

/**
 * Watch less, html, images, fonts, translations, javascript and rebuild them
 */
gulp.task('watch', 'Watch less, html, images, fonts, javascript and rebuild them.', ['clean', 'images', 'fonts', 'configs', 'build-vendor-js', 'build-vendor-css'], function() {
  return gulp.start(['watchTask', 'watchify', 'less', 'html']);
});

/**
 * Build all files and get them ready for production without the revision
 */
gulp.task('build:all', 'Build all files and get them ready for production without the revision.', ['clean', 'images', 'fonts', 'configs', 'build-vendor-js', 'build-vendor-css'], function(done) {
  process.env.NODE_ENV = 'production'; // eslint-disable-line no-process-env
  return runSequence('browserify', 'less', 'html', done);
});

/**
 * Build all files and get them ready for production with the revision
 */
gulp.task('build', 'Build all files and get them ready for production with the revision.', function (done) {
  return runSequence('build:all', 'revision', done);
});

/**
 * Build vendor javascript files
 */
gulp.task('build-vendor-js', 'Build vendor javascript files.', function() {
  return gulp.src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
  ])
  .pipe(concat('vendor.js'))
  .pipe(gulp.dest('public/dist/js'));
});

/**
 * Build vendor css files
 */
gulp.task('build-vendor-css', 'Build vendor css files.', function() {
  return gulp.src([
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
  ])
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('public/dist/css'));
});
