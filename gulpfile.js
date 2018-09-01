const gulp = require('gulp');
const ts = require('gulp-typescript');

const package = ts.createProject('tsconfig.json');
const distId = process.argv.indexOf('--dist');
const packageName = 'nest-emitter';
const dist = distId < 0 ? `node_modules/${packageName}` : process.argv[distId + 1];

gulp.task('build', () => {
  return package
    .src()
    .pipe(package())
    .pipe(gulp.dest(dist));
});

gulp.task('move', function() {
  gulp
    .src([`node_modules/${packageName}/**/*`])
    .pipe(gulp.dest(`examples/node-emitter/node_modules/${packageName}`));
});
