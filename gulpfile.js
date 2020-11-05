// Inicializa Modulos
const {src , dest, watch, series, parallel} = require(`gulp`);
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// Archivos de variables
const files = {
	scssPath: 'app/scss/**/*.scss',
	jsPath: 'app/js/**/*.scss'
}

// Tareas de scss 
function scssTask(){    
	return src(files.scssPath)
			.pipe(sourcemaps.init()) // initialize sourcemaps first
			.pipe(sass()) // compile SCSS to CSS
			.pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
			.pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
			.pipe(dest('dist')
	);
}
// Tareas de javasript
function jsTask(){
	return src([
			files.jsPath
			//,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
			])
			.pipe(concat('all.js'))
			.pipe(uglify())
			.pipe(dest('dist')
	);
}

function cacheBustTask(){
	var cbString = new Date().getTime();
	return src(['index.html'])
			.pipe(replace(/cb=\d+/g, 'cb=' + cbString))
			.pipe(dest('.'));
}

// Tareas de visualizacion
function watchTask(){
	watch([files.scssPath, files.jsPath],
			{interval: 1000, usePolling: true}, //Makes docker work
			series(
					parallel(scssTask, jsTask),
					cacheBustTask
			)
	);    
}

// Taras generales
exports.default = series(
	parallel(scssTask, jsTask), 
	cacheBustTask,
	watchTask
);