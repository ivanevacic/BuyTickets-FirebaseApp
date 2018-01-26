const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');

//Compile Sass & inject into browser
gulp.task('sass', ()  => {
  //Compile all of our Sass
  return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss',
                   'src/scss/*.scss'])
                      .pipe(sass())
                      .pipe(gulp.dest('src/css'))
                      .pipe(browserSync.stream());
});

//Move JavaScript files to src/js
gulp.task('js', () => {
  return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js',
                   'node_modules/jquery/dist/jquery.min.js',
				   'node_modules/popper.js/dist/umd/popper.min.js'])
						.pipe(gulp.dest('src/js'))
						.pipe(browserSync.stream());
});

//Watch Sass & Server
gulp.task('serve', ['sass'], () => {
	browserSync.init({
		server:	'./src'
	});
	gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss',
				'src/scss/*.scss'],
				['sass']);
	gulp.watch('src/*.html').on('change', browserSync.reload);
});

//Move Fonts folder to src
gulp.task('fonts', () => {
	return gulp.src('node_modules/fonts-awesome/fonts/*')
		pipe(gulp.dest('src/fonts'));
});

//Move Font Awesome css to src/css
gulp.task('fa', () => {
	return gulp.src('node_modules/fonts-awesome/css/font-awesome.min.css')
		pipe(gulp.dest('src/css'));
});

//When we run gulp it runs all specified gulp tasks
gulp.task('default', [
	'js',
	'serve',
	'fa',
	'fonts'
]);