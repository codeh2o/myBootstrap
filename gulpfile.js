var gulp = require('gulp'),
    gulpSass = require('gulp-sass'),
    replace = require('gulp-replace'),
    uglify = require("gulp-uglify"),
    minifyCss = require("gulp-clean-css"),
    concat = require("gulp-concat"),
    util = require('gulp-util'),
    autoprefixer = require('gulp-autoprefixer'), 
    rev = require('gulp-rev'),    
    revCollector = require('gulp-rev-collector');



var config = {
    production: !!util.env.production
};
var uglifyConfig = {
    compress: {
        ie8: true
    },
    mangle: {
        ie8: true
    },
    output: {
        ie8: true
    }
};

gulp.task('font', function () {
    return gulp.src(['node_modules/bootstrap-sass/assets/fonts/bootstrap/*', 'node_modules/font-awesome/fonts/*'], {
            base: "node_modules"
        })
        .pipe(gulp.dest('publish/static/fonts/'))
});

gulp.task('ie8', function () {
    gulp.src([
            'assets/js/ie8/html5shiv.min.js',
            'assets/js/ie8/respond.min.js',
            'node_modules/es5-shim/es5-shim.min.js'
        ])
        .pipe(concat('ie8shim.js'))
        .pipe(gulp.dest('publish/static/js/'));
});

/*****************************
 * demo theme 
 */
gulp.task('sass', function () {
    gulp.src('assets/sass/*.scss')
        .pipe(gulpSass())
        .pipe(replace(/~([^"]+\.(?:woff|ttf|otf|eot|svg)[^"]*)/ig, '../../../fonts/$1'))
        .pipe(autoprefixer({
            browsers: ['last 4 versions', 'Android >= 4.0'],
            cascade: true,
            remove:true
        }))
        .pipe(config.production ? minifyCss() : util.noop())
        .pipe(gulp.dest('publish/static/css'));
});

gulp.task('js', function () {
    gulp.src([
            'assets/js/jquery-1.12.4.js',
            'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
            'assets/js/common.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(config.production ? uglify(uglifyConfig) : util.noop())
        .pipe(gulp.dest('publish/static/js/'));


    gulp.src([
            'assets/js/app.js',
        ])
        .pipe(concat('app.js'))
        .pipe(config.production ? uglify() : util.noop())
        .pipe(gulp.dest('publish/static/js/'));
});



/*****************************
 *  Gulp command
 */

gulp.task('default',  ['sass', 'js', 'font', 'ie8'] ,function () {
    util.log('********Process complete*********');
});

gulp.task('watch', ['default'], function () {
    gulp.watch('assets/**/*.@(js|scss|css|less)', ['default']);
});