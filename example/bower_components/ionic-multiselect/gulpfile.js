var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('scripts', function() {
  var src = [
      'dist/ionic-multiselect.js',
  ];

  return gulp.src(src)
    .pipe(concat('ionic-multiselect.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
});
