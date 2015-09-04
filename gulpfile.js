'use strict';

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    chalk = require('chalk'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    paths = {
      scripts: ['src/js/**/*.js']
    };


gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('build', ['lint'], function () {
  browserify({
    entries: 'src/js/app.js',
    extensions: '.js',
    debug: true
  })
  .transform(babelify)
  .bundle()
  .pipe(source('dist.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['build']);
});

gulp.task('default', ['build']);
