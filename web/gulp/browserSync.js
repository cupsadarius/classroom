/**
 * Created by Cosmin on 19/08/15.
 */

var gulp = require('gulp'),
  url = require('url'),
  fs = require('fs'),
  path = require('path'),
  browserSync = require('browser-sync'),
  folder = path.resolve(__dirname, "./../public/");

gulp.task('browserSync', function () {
  browserSync({
    server: {
      baseDir: './public/',
      middleware: function (req, res, next) {
        var fileName = url.parse(req.url);
        fileName = fileName.href.split(fileName.search).join("");
        var fileExists = fs.existsSync(folder + fileName);
        if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
          req.url = "/index.html";
        }
        return next();
      }
    }
  })
});
