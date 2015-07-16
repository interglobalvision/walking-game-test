/**
 * @file
 * Portable Gulp tool that checks a Meteor installation for js syntax errors.
 */
/* globals require */

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  jscs = require('gulp-jscs');

/**
 * @task JavaScript lint.
 *   Runs JSCS and JSHint on server, client, lib, and gulp files.
 */
gulp.task('lintjs', function () {
  return gulp.src([
    'gulpfile.js',
    'app/**/*.js',
    '!app/.meteor/**/*.js',
    '!app/packages/**/*.js',
    '!node_modules/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(jscs());
});

/**
 * @task JavaScript/JSON watch.
 *   Watches changes on relevant js and json files and reports accordingly.
 */
gulp.task('watch', function () {
  gulp.watch([
    'gulpfile.js',
    'app/**/*.js',
    '!app/.meteor/**/*.js',
    '!app/packages/**/*.js',
    '!node_modules/**/*.js'
  ], ['lintjs']);
});

gulp.task('default', ['watch']);
