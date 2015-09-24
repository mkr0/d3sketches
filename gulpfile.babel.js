import gulp from 'gulp';
import eslint from 'gulp-eslint';
import jade from 'gulp-jade';
import stylus from 'gulp-stylus';
import chalk from 'chalk';
import del from 'del';
import runSeq from 'run-sequence';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import fs from 'fs';

const paths = {
  scripts: ['src/js/**/*.js'],
  sketches: 'src/js/sketches/',
  templates: ['src/**/*.jade'],
  stylus: ['src/stylus/**/*.styl'],
  appStylus: 'src/stylus/app.styl',
  dist: 'dist'
};

gulp.task('clean', () => {
  return del(paths.dist);
});

gulp.task('build-templates', () => {
  // TODO - use config file to control order of links.
  let links = fs.readdirSync(paths.sketches).map((file) => {
    let fname = file.slice(0, -3);
    return {
      name: fname, 
      href: `${fname}.html`
    };
  });

  return gulp.src(paths.templates)
    .pipe(jade({
      locals: {links: links}
    }))
    .pipe(gulp.dest(paths.dist))
    .pipe(browserSync.stream());
});

gulp.task('build-css', () => {
  return gulp.src(paths.appStylus)
    .pipe(stylus())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('lint', () => {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('build-js', ['lint'], () => {
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

gulp.task('serve', ['build'], () => {
  browserSync.init({
    server: { baseDir: paths.dist }
  });
  gulp.watch(paths.scripts, ['watch-js']);
  gulp.watch(paths.templates, ['watch-templates']);
  gulp.watch(paths.stylus, ['watch-stylus']);
});

gulp.task('build', ['clean'], () => {
  return runSeq(['build-js','build-css', 'build-templates']);
});

gulp.task('default', ['build']);
