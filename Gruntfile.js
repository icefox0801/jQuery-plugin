/**
 * Created with JetBrains WebStorm.
 * User: icefox
 * Date: 1/10/14
 * Time: 9:40 PM
 * To change this template use File | Settings | File Templates.
 */

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	//config
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// clean files before dist
		clean: {
			before: {
				src: ['dist/tmp/', 'dist/']
			},
			after: {
				src: ['dist/tmp', 'dist/js']
			}

		},

		// copy files from source folder to destination folder
		copy: {
			dist: {
				expand: true,
				flatten: true,
				src: 'src/**/*.js',
				dest: 'dist/tmp',
				filter: 'isFile'
			}
		},

		//compress js files with uglifyJS
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