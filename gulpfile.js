var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
//var sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', function() {
  return gulp.src('src/less/styles.less')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less())
    .pipe(plugins.autoprefixer())
    .pipe(gulp.dest('dist/css'))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.cssmin())
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    //.on('error', gutil.log)
    .pipe(plugins.notify({ message: 'Styles Task Complete' }));
});

gulp.task ('scripts', function() {
  return gulp.src(['src/vendor/js/*.js','src/js/*.js'])
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(plugins.notify({ message: 'Scripts Task Complete' }));
});

gulp.task('watch', function() {
  plugins.livereload.listen();
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/less/*.less',['styles']);
  gulp.watch(['dist/**']).on('change',plugins.livereload.changed);
});
