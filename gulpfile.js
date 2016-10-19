var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var webpack = require('webpack-stream');
var exec = require('child_process').exec;
var CommonsPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var fs = require('fs');
var named = require('vinyl-named');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var bless = require('gulp-bless');
var imagemin = require('gulp-imagemin');
var cssmin = require('gulp-cssmin');
var uncss = require('gulp-uncss');


gulp.task('compile-sass', function() {
  var sassPaths = [
    'node_modules/foundation-sites/scss',
    'node_modules/motion-ui/src'
  ];
  return gulp.src('./src/scss/app.scss')
    .pipe(
      $.sass({
        includePaths: sassPaths
      }).on('error', $.sass.logError)
    )
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9', 'last 3 iOS versions']
    }))
    .pipe(bless())
    .pipe(gulp.dest('./build/css'));
});

gulp.task('compile-js', [], function() {
  var compiled_dir = './build/js/';
  // TODO: gulp isn't creating "compiled" dir, so this is a temporary fix that runs a shell cmd to do it
  exec('mkdir -p '+ compiled_dir);

  return gulp.src('./src/js/**/*.js')
    .pipe(named())
    .pipe(webpack({
      module: {
        loaders: [
          {test: /\.css$/, loader: 'css-loader'},
          {
            test: /.*\.(gif|png|jpe?g|svg)$/i,
            loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]',
              'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
            ]
          }
        ]
      },
      plugins: [
        new CommonsPlugin({
          minChunks: 3,
          name: "common"
        })
      ]
    }))
    .pipe(gulp.dest(compiled_dir));
});

gulp.task('minify-js', ['compile-js'], function() {

  return gulp.src('./build/js/**')
    .pipe(uglify())
    .pipe(gulp.dest('./build/js/'));
});

gulp.task('minify-images', ['cp-static'], function() {
	return gulp.src('./build/img/**')
		.pipe(imagemin())
		.pipe(gulp.dest('./build/img'));
});

gulp.task('minify-css', ['cp-static'], function() {
	return gulp.src('./build/css/**')
		.pipe(cssmin())
		.pipe(uncss({
      html: ['src/**/*.php']
    }))
		.pipe(gulp.dest('./build/css'));
});

gulp.task('cp-static', ['compile-sass', 'compile-js'], function() {
  var dirs = [
    '!./src/scss',
    '!./src/scss/**',
    '!./src/js',
    '!./src/js/**',
    './src/**'
  ];
  return gulp.src(dirs).pipe(gulp.dest('./build'));
});


gulp.task('build', ['compile-sass', 'compile-js', 'cp-static']);

gulp.task('build-production', ['build', 'minify-js', 'minify-css', 'minify-images']);

gulp.task('dev', ['compile-sass', 'compile-js', 'cp-static'], function() {
  gulp.watch(['./src/sass/**'], ['compile-sass']);
  gulp.watch(['./src/js/**'], ['compile-js']);
  gulp.watch([
    '!./src/scss',
    '!./src/scss/**',
    '!./src/js',
    '!./src/js/**',
    './src/**'
  ], ['cp-static']);
});

gulp.task('default', ['build']);
