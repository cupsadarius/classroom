/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp-help')(require('gulp')),
  rev = require('gulp-rev'),
  runSequence = require('run-sequence'),
  revReplace = require('gulp-rev-replace'),
  config = require('./config');

/**
 * Create new revisions for css files
 */
gulp.task('revision:css', 'Create new revisions for css files', function () {
  return gulp.src([
    config.buildCss + '/app.css',
    config.buildCss + '/vendor.css',
  ])
    .pipe(rev())
    .pipe(gulp.dest(config.buildCss))  // write rev'd assets to build dir
    .pipe(rev.manifest('rev-manifest-css.json'))
    .pipe(gulp.dest(config.buildHtml)); // write manifest to build dir
});

/**
 * Create new revisions for js files
 */
gulp.task('revision:js', 'Create new revisions for js files', function () {
  return gulp.src([
    config.buildJs + '/app.js',
    config.buildJs + '/eventSource.js',
    config.buildJs + '/ie8.js',
    config.buildJs + '/vendor.js',
  ])
    .pipe(rev())
    .pipe(gulp.dest(config.buildJs))  // write rev'd assets to build dir
    .pipe(rev.manifest('rev-manifest-js.json'))
    .pipe(gulp.dest(config.buildHtml)); // write manifest to build dir
});

/**
 * Create new revisions for html files
 */
gulp.task('revision:html', 'Create new revisions for html files', function () {
  var manifestJs = gulp.src(config.buildHtml + "/rev-manifest-js.json");
  var manifestCss = gulp.src(config.buildHtml + "/rev-manifest-css.json");
  return gulp.src(config.htmlMain)
    .pipe(revReplace({manifest: manifestJs}))
    .pipe(revReplace({manifest: manifestCss}))
    .pipe(gulp.dest(config.buildHtml));
});

/**
 * Create new revisions for css, js and html files
 */
gulp.task('revision', 'Create new revisions for css, js and html files', function (done) {
  runSequence('revision:js', 'revision:css', 'revision:html', done);
});
