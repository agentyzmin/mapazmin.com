var del = require('del'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    change = require('gulp-change'),
    htmlmin = require('gulp-htmlmin'),
    cleanCSS = require('gulp-clean-css'),
    less = require('gulp-less');

gulp.task('default', ['watch']);

gulp.task('watch', ['build-css', 'build-js-bundle'], function() {
    gulp.watch('./*.less', ['build-css']);
    gulp.watch('./styles/*.less', ['build-css']);
    gulp.watch('./{configs,directives,factories,libs,pages}/*.js', ['build-js-bundle']);
    gulp.watch('./{configs,directives,factories,libs,pages}/**/*.js', ['build-js-bundle']);
});

gulp.task('release', ['build-css-min', 'build-js-bundle-min', 'build-index-html', 'minify-html', 'copy-required-files']);

gulp.task('clean-release', function() {
    return del([
        './release/*',
        './release/**/*'
    ]);
});

// CSS
gulp.task('build-css', function() {
    return gulp
        .src(['./style.less'])
        .pipe(less().on('error', function(err) {
            console.log(err);
            this.emit('end');
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('build-css-min', function() {
    return gulp
        .src(['./style.css'])
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('./release/'));
});

// JS
gulp.task('build-js-libs', function() {
    return gulp
        .src([
            './libs/jquery.min.js',
            './libs/angular.min.js',
            './libs/angular-route.min.js',
            './libs/leaflet.js'
        ])
        .pipe(concat('libs.bundle.tmp'))
        .pipe(gulp.dest('./'));
});

gulp.task('build-js-app', function() {
    return gulp
        .src([
            './{configs,directives,factories,pages}/*.js',
            './{configs,directives,factories,pages}/**/*.js'
        ])
        .pipe(concat('app.bundle.tmp'))
        .pipe(gulp.dest('./'));
});

gulp.task('build-js-app-min', ['build-js-app'], function() {
    return gulp
        .src(['app.bundle.tmp'])
        .pipe(concat('app.bundle.min.tmp'))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('build-js-bundle', ['build-js-libs', 'build-js-app'], function() {
    return gulp
        .src([
            './libs.bundle.tmp',
            './app.bundle.tmp'
        ])
        .pipe(concat('app.bundle.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('build-js-bundle-min', ['build-js-libs', 'build-js-app-min'], function() {
    return gulp
        .src([
            './libs.bundle.tmp',
            './app.bundle.min.tmp'
        ])
        .pipe(concat('release/app.bundle.min.js'))
        .pipe(gulp.dest('./'));
});

// HTML
gulp.task('build-index-html', function() {
    return gulp
        .src(['./index.html'])
        .pipe(change(replace))
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./release/'));

    function replace(content, done) {
        content = content.replace(/build\s*=\s*\d+/gi, 'build=' + new Date().getTime());
        content = content.replace(/app.bundle.js/gi, 'app.bundle.min.js');

        done(null, content);
    }
});

gulp.task('minify-html', function() {
    return gulp
        .src([
            './directives/**/*.html',
            './pages/**/*.html'
        ], { base: './' })
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./release'));
});

gulp.task('copy-required-files', function() {
    return gulp
        .src([
            './geojson/*.json',
            './fonts/*',
            './.htaccess'
        ], { base: './' })
        .pipe(gulp.dest('./release'));
});