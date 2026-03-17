const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const localtunnel = require('localtunnel');

// Compile SCSS into CSS
function style() {
  return gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./css'))
    .pipe(browserSync.stream());
}

// Watch for changes and update browser
function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  }, (err, bs) => {
    const port = bs.options.get('port');
    tunnel(port);
  });
  gulp.watch('./scss/**/*.scss', style);
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('./js/**/*.js').on('change', browserSync.reload);
}

// Tunnel for remote access
async function tunnel(port) {
  const t = await localtunnel({ port: port });
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------');
  console.log('\x1b[36m%s\x1b[0m', '   Remote Access URL: ' + t.url);
  console.log('\x1b[36m%s\x1b[0m', '---------------------------------------');

  t.on('close', () => {
    console.log('Tunnel closed');
  });
}

exports.style = style;
exports.watch = watch;
exports.tunnel = tunnel;
exports.default = gulp.series(style, watch);
