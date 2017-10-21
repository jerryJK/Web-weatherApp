var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var uglifycss = require('gulp-uglifycss');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');


gulp.task('sass', function() {
    return gulp.src('scss/main.scss')
        //.pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            //sourceComments: 'map'
        }))
        .pipe(postcss([autoprefixer()]))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }));

});


gulp.task('minify-js', function() {
    return gulp.src('js/app.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('minify-css', ['sass'], function() {
    return gulp.src('dist/main.css')
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


gulp.task('autoprefixer', function() {

    return gulp.src('./css/main.css')
        //.pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    });
});

gulp.task('watch', ['browserSync', 'sass'], function() {
    gulp.watch('scss/**/*.scss', ['sass']);
});
