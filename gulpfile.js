"use strict";
var gulp =
	require('gulp'),
	watch = require('gulp-watch'),
	autoprefixer = require('gulp-autoprefixer'),
	uglify = require('gulp-uglify'),
	stylus = require('gulp-stylus'),
	rigger = require('gulp-rigger'),
	csso = require('gulp-csso'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	browserSync = require("browser-sync"),
	concat = require('gulp-concat'),
	jscs = require('gulp-jscs'),
	rimraf = require('rimraf'),
	jslint = require('gulp-jslint'),
	reload = browserSync.reload;

var path = {
	prod: {
		html: 'prod/',
		js: 'prod/js/',
		css: 'prod/css/',
		img: 'prod/i/',
		fonts: 'prod/fonts/'
	},
	dev: {
		html: 'dev/*.html',
		js: 'dev/js/app.js',
		styl: 'dev/styl/style.styl',
		img: 'dev/i/**/*.*',
		fonts: 'dev/fonts/fonts.css'
	},
	watch: {
		html: 'dev/**/*.html',
		js: 'dev/js/**/*.js',
		styl: 'dev/styl/**/*.styl',
		img: 'dev/i/**/*.*',
		fonts: 'dev/fonts/fonts.css'
	},
	clean: './prod'
};

gulp.task('html:prod', function () {
	gulp.src(path.dev.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.prod.html))
		.pipe(reload({stream: true}));
});

gulp.task('js:prod', function () {
	gulp.src(path.dev.js)
		.pipe(rigger())
		.pipe(uglify())
		.pipe(gulp.dest(path.prod.js))
		.pipe(reload({stream: true}));
});

gulp.task('styl:prod', function () {
	gulp.src(path.dev.styl)
		.pipe(rigger())
		.pipe(stylus())
		.pipe(autoprefixer())
		.pipe(concat('style.css'))
		.pipe(csso())
		.pipe(gulp.dest(path.prod.css))
		.pipe(reload({stream: true}));
});

gulp.task('image:prod', function () {
	gulp.src(path.dev.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.prod.img))
		.pipe(reload({stream: true}));
});

gulp.task('fonts:prod', function() {
	gulp.src(path.dev.fonts)
		.pipe(gulp.dest(path.prod.fonts))
});

gulp.task('prod', [
	'html:prod',
	'js:prod',
	'styl:prod',
	'fonts:prod',
	'image:prod'
]);

gulp.task('watch', function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start('html:prod');
	});
	watch([path.watch.styl], function(event, cb) {
		gulp.start('styl:prod');
	});
	watch([path.watch.js], function(event, cb) {
		gulp.start('js:prod');
	});
	watch([path.watch.img], function(event, cb) {
		gulp.start('image:prod');
	});
	watch([path.watch.fonts], function(event, cb) {
		gulp.start('fonts:prod');
	});
});

gulp.task('webserver', function () {
	browserSync({
		open: false,
		server: {
			baseDir: "./prod/",
		},
		tunnel: true,
		host: 'localhost',
		port: 9000
	});
});

gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

gulp.task('default', ['prod', 'watch', 'webserver']);