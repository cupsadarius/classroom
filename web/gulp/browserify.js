'use strict'; // eslint-disable-line strict

let gulp = require('gulp');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let babelify = require('babelify');
let uglify = require('gulp-uglify');
let argv = require('yargs').argv;
let gulpif = require('gulp-if');
let sourcemaps = require('gulp-sourcemaps');
let config = require('./config');
let resolutions = require('browserify-resolutions');
let es3ify = require('gulp-es3ify');

let isProduction = (!argv.env || argv.env === 'production');
console.log(`gulp.browserify: isProduction = ${isProduction}`);

gulp.task('browserify', () => {
  browserify(config.jsMain)
    .plugin(resolutions, ['react'])
    .transform(babelify)
    .bundle()
    .pipe(source(config.bundle))
    .pipe(buffer())
    .pipe(gulpif(!isProduction, sourcemaps.init()))
    .pipe(es3ify())
    .pipe(uglify({
      mangle: false,
      compress:false,
      output: {
        screw_ie8 : false,
      },
    }))
    .pipe(gulpif(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(config.buildJs));
});
