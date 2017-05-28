var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    less = require('gulp-less');

gulp.task('default', ['watch']);

gulp.task('watch', ['build-css', 'build-js'], function() {
    gulp.watch('./*.less', ['build-css']);
    gulp.watch('./styles/*.less', ['build-css']);
    gulp.watch('./js/app.js', ['build-js']);
});

gulp.task('build-css', function() {
    return gulp
        .src(['./style.less'])
        .pipe(less().on('error', function(err) {
            console.log(err);
            this.emit('end');
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('build-js', ['uglify'], function() {
    return gulp
        .src([
            './js/jquery-3.1.1.min.js',
            './js/jquery.inputmask.bundle.min.js',
            './js/app.min.js'
        ])
        .pipe(concat('app.bundle.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('uglify', function() {
    return gulp
        .src('./js/app.js')
        .pipe(uglify().on('error', function(err) {
            console.log(err);
            this.emit('end');
        }))
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./js/'));
});