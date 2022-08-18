const gulp = require('gulp');
const ts = require('gulp-typescript');

const cjsProject = ts.createProject('tsconfig.cjs.json');
const esmProject = ts.createProject('tsconfig.esm.json');

gulp.task('build', () => {
  return gulp.src('src/**/*.ts')
    .pipe(cjsProject())
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', () => {
  return gulp.src('src/**/*.pegjs')
    .pipe(gulp.dest('dist'));
});

gulp.task('build:esm', () => {
  return gulp.src('src/**/*.ts')
    .pipe(esmProject())
    .pipe(gulp.dest('esm'));
});

gulp.task('copy:esm', () => {
  return gulp.src('src/**/*.pegjs')
    .pipe(gulp.dest('esm'));
});
