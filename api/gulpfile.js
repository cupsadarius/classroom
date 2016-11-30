var gulp = require('gulp');
var ts = require('gulp-typescript');
var clean = require('gulp-clean');
var server = require('gulp-develop-server');
var mocha = require('gulp-mocha');
var tslint = require("gulp-tslint");
var serverTS = ["src/**/*.ts", "tests/*.ts", "tests/**/*.ts", "!node_modules/**", '!bin/**'];
var tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', ['clean'], function() {
    return tsProject.src().pipe(ts(tsProject)).pipe(gulp.dest('_compiled'));
});

gulp.task("lint", () =>
    gulp.src(['tests/*.ts', 'src/*.ts', 'src/**/*.ts'])
        .pipe(tslint({
            formatter: "prose",
            configuration: "tslint.json"
        }))
        .pipe(tslint.report())
);

gulp.task('clean', function () {
    return gulp
        .src([
            '_compiled/**/*.js',
            '_compiled/**/*.js.map',
            '!node_modules/**',
            '!gulpfile.js',
            '!bin/**'
        ], {read: false})
        .pipe(clean())
});

gulp.task('server:start', ['lint', 'ts'], function() {
    server.listen({path: 'bin/server.js'}, function(error) {
        console.log(error);
    });
});

gulp.task('server:restart', ['lint', 'ts'], function() {
    server.restart();
});

gulp.task('default', ['server:start'], function() {
    gulp.watch(serverTS, ['server:restart']);
});

gulp.task('test', ['ts'], function() {
    return gulp.src(['_compiled/tests/*Test.js'], { read: false })
    .pipe(mocha({
      reporter: 'tap',
    })).once('end', () => {
            process.exit();
    });
})
