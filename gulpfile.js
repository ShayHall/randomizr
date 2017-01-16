/* jshint globalstrict: true */
/* globals require */
/* globals console */
'use strict';

const gulp = require('gulp');

// Core
const browserSync = require('browser-sync');
const clone = require('gulp-clone');
const del = require('del');
const ghPages = require('gulp-gh-pages');
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const spy = require('gulp-spy');
const merge = require('merge-stream');
const path = require('path');
const runSequence = require('run-sequence');
const filter = require('through2-filter').obj;

// JS
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const jshint = require('gulp-jshint');
const uglifym = require('gulp-uglify/minifier');
const uglifyh = require('uglify-js-harmony');
var uglify = (opts) => uglifym(opts, uglifyh);  // support ES2015

// Images
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const svgSprite = require('gulp-svg-sprite');

// Styles
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const scssLint = require('gulp-scss-lint');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');

// HTML
const kit = require('gulp-kit');
const htmlmin = require('gulp-htmlmin');


// Folder Paths
const dist = {
  base: './dist/',
  assets: './dist/assets/'
};
const src = {
  base: './src/',
  assets: './src/assets/'
};


const trace = false;  // set true to trace build pipelines


// Browser Sync
gulp.task('browser-sync', () =>
  browserSync({
    server: {
       baseDir: path.normalize(dist.base)
    }
  })
);

gulp.task('bs-reload', () =>
  browserSync.reload()
);


// Clean
gulp.task('clean', () =>
  del([
    path.join(dist.assets, 'images/**/*'),
    path.join(dist.assets, 'icons/**/*'),
    path.join(dist.assets, 'css/**/*'),
    path.join(dist.assets, 'js/**/*'),
    path.join(dist.assets, 'maps/**/*'),
    path.join(dist.base, '*.*'),
    path.join(dist.assets, 'fonts/**/*')
  ])
);


// Images
gulp.task('images', () =>
  gulp.src(path.join(src.assets, 'images/**/*'))
    .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
    .pipe(spy({ log: trace, prefix: 'images:' }))
    .pipe(gulp.dest(path.join(dist.assets, 'images/')))
);


// SVG Sprite
const spriteConfig = {
  mode: {
    symbol: {
      render: {
        css: false,
        scss: false
      },
      dest: 'icons',
      prefix: '.icon--%s',
      sprite: 'sprite.svg'
    }
  }
};

gulp.task('icons', () =>
  gulp.src('node_modules/@console/bluemix-icons/sprite.svg')
    .pipe(spy({ log: trace, prefix: 'icons in:' }))
    .pipe(svgSprite(spriteConfig))
    .pipe(spy({ log: trace, prefix: 'icons out:' }))
    .pipe(gulp.dest(dist.assets))
);


// Sass
gulp.task('styles', () => {
  gulp.src(path.join(src.assets, 'scss/**/*.scss'))
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(scssLint())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: ['> 1%', 'last 2 versions']})
    ]))
    .pipe(sourcemaps.write('../maps', { sourceRoot: null }))
    .pipe(spy({ log: trace, prefix: 'styles (uncompressed):' }))
    .pipe(gulp.dest(path.join(dist.assets, 'css/')))
    .pipe(filter(chunk => !chunk.path.endsWith('.map')))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('../maps'))
    .pipe(spy({ log: trace, prefix: 'styles:' }))
    .pipe(gulp.dest(path.join(dist.assets, 'css/')))
    .pipe(browserSync.stream({match: '**/*.css'}));
});


// Javascript
gulp.task('scripts', () => {
  let source = gulp.src(path.join(src.assets, 'js/**/*.js'))
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.plugin + ': ' + error.message + ', line ' + error.lineNumber);
        this.emit('end');
    }}))
    .pipe(spy({ log: trace, prefix: 'scripts (input):' }))
    .pipe(jshint({ esnext: true }))
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'));

  let uncompressed = merge(
    source,
    source.pipe(clone())
      .pipe(rename({ suffix: '.es5' }))
      .pipe(babel({ presets: ['es2015'] }))
  );

  let output = merge(
    uncompressed,
    uncompressed.pipe(clone())
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
  );

  return output
    .pipe(sourcemaps.write('../maps'))
    .pipe(spy({ log: trace, prefix: 'scripts (output):' }))
    .pipe(gulp.dest(path.join(dist.assets, 'js/')))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('gulpfile', () =>
  // physician, heal thyself
  gulp.src('gulpfile.js')
    .pipe(jshint({esnext: true}))
    .pipe(jshint.reporter('default')));


// Kit Files
gulp.task('kit', () =>
  gulp.src(path.join(src.base, 'views/**/*.kit'))
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(kit())
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(spy({ log: trace, prefix: 'kit:' }))
    .pipe(gulp.dest(dist.base))
    .pipe(browserSync.reload({stream:true}))
);


// Fonts
gulp.task('fonts', () =>
  gulp.src(path.join(src.assets, 'fonts/*'))
    .pipe(spy({ log: trace, prefix: 'fonts:' }))
    .pipe(gulp.dest(path.join(dist.assets, 'fonts/')))
);


// Default
gulp.task('default', ['browser-sync'], () => {
  gulp.watch(path.join(src.assets, 'scss/**/*.scss'), ['styles']);
  gulp.watch(path.join(src.assets, 'js/**/*.js'), ['scripts']);
  gulp.watch(path.join(src.assets, 'images/**/*'), ['images']);
  gulp.watch(path.join(src.assets, 'icons/**/*'), ['icons']);
  gulp.watch(path.join(src.base, 'views/**/*.kit'), ['kit']);
});


// Build
gulp.task('build', (cb) =>
  runSequence(
    'clean',
    ['fonts', 'styles', 'scripts', 'images', 'icons'],
    'kit',
    cb
  )
);


// Deploy
gulp.task('deploy', () =>
  gulp.src(path.join(dist.base, '**/*'))
    .pipe(ghPages())
);
