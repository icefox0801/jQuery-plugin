/**
 * Plugin Definition
 * version: 1.0.0
 * Author: ZhJF
 * Email: icefox0801@hotmail.com
 * Date: 2014/01/19
 * Requires: jquery.js
 */
define(['jquery'], function($){
	var GLOBAL = {
		debug: true,
		ajax: true
	}

	var plugin = {

		define: function(name, options){

			// 利用闭包，将name变量保存在内存中，这样当插件Instance类被实例化后，自动获得name属性
			var Instance =  function() {
				this.name = name;
			};

			Instance.prototype = new Plugin(); // 继承
			Instance.prototype.constructor = Instance;

			// $.extend(Instance.prototype, Plugin.prototype);

			return Instance;
		},

		initConfig: function(options) {

			if(typeof options === 'object') {
				GLOBAL = $.extend({}, GLOBAL , options)
			}
		}
	}
	/**
	 * Plugin Class
	 * @constructor
	 */
	var Plugin = function() {

	}

	Plugin.prototype = {

		debug: function (error) {
			if (window.console && window.console.log) {
				console.error(this.name + error);
			}
		}
	}

	return plugin;
});

