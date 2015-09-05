'use strict';

var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    jade = require('gulp-jade'),
    stylus = require('gulp-stylus'),
    chalk = require('chalk'),
    del = require('del'),
    runSeq = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    paths = {
      scripts: ['src/js/**/*.js'],
      templates: ['src/**/*.jade'],
      stylus: ['src/stylus/**/*.styl'],
      appStylus: 'src/stylus/app.styl',
      dist: 'dist'
    };

gulp.task('clean', function () {
  return del(paths.dist);
});

gulp.task('build-templates', function () {
  return gulp.src(paths.templates)
    .pipe(jade())
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('build-css', function () {
  return gulp.src(paths.appStylus)
    .pipe(stylus())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('build-js', ['lint'], function () {
  return browserify({
      entries: 'src/js/app.js',
      extensions: '.js',
      debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('dist.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('watch-js', ['build-js'], browserSync.reload);
gulp.task('watch-templates', ['build-templates'], browserSync.reload);
gulp.task('watch-stylus', ['build-css'], browserSync.reload);

gulp.task('serve', ['build'], function () {
  browserSync.init({
    server: { baseDir: paths.dist }
  });
  gulp.watch(paths.scripts, ['watch-js']);
  gulp.watch(paths.templates, ['watch-templates']);
  gulp.watch(paths.stylus, ['watch-stylus']);
});

gulp.task('build', ['clean'], function () {
  return runSeq(['build-js','build-css', 'build-templates']);
});

gulp.task('default', ['build']);
