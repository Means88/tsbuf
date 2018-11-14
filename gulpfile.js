const gulp = require('gulp');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.build.json');

gulp.task('build', () => {
  return gulp.src('src/**/*.ts')
    .pipe(tsProject())
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', () => {
  return gulp.src('src/**/*.pegjs')
    .pipe(gulp.dest('dist'));
});
