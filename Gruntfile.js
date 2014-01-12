/**
 * Created with JetBrains WebStorm.
 * User: icefox
 * Date: 1/10/14
 * Time: 9:40 PM
 * To change this template use File | Settings | File Templates.
 */

module.exports = function(grunt) {

	var params =require('./json/build.json'); // build params

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jade');

	//config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// clean files before dist
		clean: {
			before: {
				src: ['dist/']
			},
			after: {
				src: ['dist/tmp', 'dist/js']
			}

		},

		// copy files from source folder to destination folder
		copy: {
			js: {
				expand: true,
				flatten: true,
				cwd: 'js/',
				src: 'src/**/*.js',
				dest: 'dist/tmp/js',
				filter: 'isFile'
			}
		},

		// Compile jade template into html files
		jade: {
			compile: {
				options: {
					data: params
				},

				files: [{
					expand: true,
					cwd: 'demo/',
					src: ['index.jade'],
					dest: 'dist/',
					ext: '.html'
				}]

			}
		},

		// Replace reference to non-optimized javascript and CSS
		usemin: {
			options: {

			},
			html: []
		},

		// compress js files with uglifyJS
		uglify: {

			dist: {
				expand: true,
				flatten: true,
				cwd: 'dist/',
				src: 'tmp/*.js',
				dest: 'dist/js'
			}
		},

		//concat js files into a file
		concat: {
			options: {
				separator: '\n',
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
			},

			dist: {
				src: 'dist/js/*.js',
				dest: 'dist/min/plugin.min.js'
			}
		}
	});

	// 生成index.html
	grunt.resisterTask('renderIndex', [
		'jade:compile',
	]);

	grunt.registerTask('dist', [
		'clean:before',
		'copy:dist',
		'uglify:dist',
		'concat:dist',
		'clean:after'
	]);

	grunt.registerTask('default', [
		'dist'
	]);
};