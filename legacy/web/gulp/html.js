//variables
var gulp = require('gulp-help')(require('gulp')),
  usemin = require('gulp-usemin'),
  minifyHtml = require('gulp-minify-html'),
  preprocess = require('gulp-preprocess'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload,
  config = require('./config');

/**
 * Minify html files and add them to distribution
 */
gulp.task('html', 'Minify html files and add them to distribution.', function() {
  return gulp.src(config.htmlMain)
    .pipe(preprocess({
      includeBase: 'src',
      context: {},
    }))
    .pipe(usemin({
      html: [minifyHtml({
        conditionals: true,
        empty: true,
      })],
    }))
    .pipe(gulp.dest(config.buildHtml))
    .pipe(reload({
      stream: true
    }));
});

module.exports = function(_config) {
  config = _config;
};
