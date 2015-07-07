var gulp = require('gulp');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');

var taskPaths = {
	js: {
		src: './private/js/**/*.js',
		dest: './public/js'
	},
	less: {
		src: './private/less/**/*.less',
		dest: './public/css'
	}
};

var watchPaths = {
	js: [taskPaths.js.src],
	less: [taskPaths.less.src]
};

gulp.task('js-app', function() {
	//
	// File order is important.
	// We want client.js to be the last one because it depends on all other libraries.
	//
    return gulp.src(['./private/js/lib/**/*.js', './private/js/client.js'])
    	.pipe(stripDebug())
    	.pipe(uglify())
    	.pipe(concat('wgsa.js'))
        .pipe(gulp.dest(taskPaths.js.dest));
});

gulp.task('js-landing', function() {
	//
	// File order is important.
	// We want client.js to be the last one because it depends on all other libraries.
	//
    return gulp.src(['./private/js/lib/landing.js', './private/js/lib/utils.js', './private/js/lib/subscribe.js', './private/js/lib/wgsa_mixpanel.js'])
    	.pipe(stripDebug())
    	.pipe(uglify())
    	.pipe(concat('landing.js'))
        .pipe(gulp.dest(taskPaths.js.dest));
});

gulp.task('js', ['js-app', 'js-landing']);

gulp.task('less', function() {
  	return gulp.src(taskPaths.less.src)
	    .pipe(less())
	    .pipe(sourcemaps.init())
	    .pipe(minifyCSS())
	    .pipe(sourcemaps.write())
    	.pipe(gulp.dest(taskPaths.less.dest));
});

gulp.task('watch', function() {
	gulp.watch(watchPaths.js, ['js']);
	gulp.watch(watchPaths.less, ['less']);
});

gulp.task('default', ['watch', 'js', 'less']);
