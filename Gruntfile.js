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
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

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
				cwd: 'demo/',
				src: 'src/**/*.js',
				dest: 'dist/tmp/js',
				filter: 'isFile'
			},
			sources: {
				expand: true,
				cwd: 'demo/',
				src: ['css/bootstrap.min.css','fonts/*','js/bootstrap.min.js'],
				dest: 'dist/sources/'
			}
		},
		// Compile jade template into html files
		jade: {
			compile: {
				options: {
					pretty: true, // default to false, will cause bug in usemin task
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
		// Replace reference with optimized javascript and CSS
		usemin: {
			html: {
				src: 'dist/index.html'
			}
		},
		// compress js files with uglifyJS
		uglify: {
			js: {
				options: {
					banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
				},
				files: {
					'dist/sources/js/plugin.min.js': ['dist/tmp/plugin.js']
				}
			}
		},
		// concat js files
		concat: {
			js: {
				options: {
					separator: '\n'
				},
				src: 'dist/tmp/js/*.js',
				dest: 'dist/tmp/plugin.js'
			}
		},
		// compress index.html
		htmlmin: {
			index: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},

				files: {
					'dist/index.html': 'dist/index.html'
				}
			}
		}
	});

	grunt.registerTask('jsmin', [
		'copy:js',
		'concat:js',
		'uglify:js'
	]);

	grunt.registerTask('copyFiles', [
		'jsmin',
		'copy:sources'
	]);
	// 生成index.html
	grunt.registerTask('jade2html', [
		'jade:compile',
		'usemin:html',
		'htmlmin:index'
	]);

	grunt.registerTask('dist', [
		'clean:before',
		'copyFiles',
		'jade2html',
		'clean:after'
	]);

	grunt.registerTask('default', [
		'dist'
	]);
};