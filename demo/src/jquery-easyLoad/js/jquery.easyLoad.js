/**
 * jquery-easyLoad Plugin
 * version: 1.0.0
 * Author: ZhJF
 * Email: icefox0801@hotmail.com
 * Time: 2013/05/09
 * Requires: jquery.js
 */

!function ($) {

	var RETURN_KEY = '13';//回车键定义

	/* CLASS DEFINITION
	 * ================ */
	/**
	 * @param section: 动态加载区域
	 * @param form: 动态加载的筛选表单
	 * @param options: 插件参数
	 */
	var EasyLoad = function (section, form, options) {
		this.options = $.extend({}, $.fn.easyLoad.defaults, options);
		this.$el = $(section);
		this.$form = $(form);
	};

	EasyLoad.prototype = {
		constructor: EasyLoad,

		/*结合分页插件获取页码的函数*/
		getPage: function (elem) {
			var $pg = $(this.options.pgApi);
			var page = $pg.data('pagination').options.page;
			if (elem) {
				page = $(elem).attr('href');
			}
			return page;
		},

		/*或者筛选表单参数的函数*/
		getParams: function () {
			var params = {};
			this.$form.length && (params = this.$form.serializeArray().toObj());
			return params;
		},

		/**
		 * 动态加载函数
		 * @param params: 筛选的参数
		 * @param callback: 动态加载后执行的函数
		 */
		loadPage: function (params, callback) {
			var that = this;
			this.$el.load(this.options.url, params, function () {
				var $this = $(this);
				$.Event('easyLoad');
				that.$el.trigger('easyLoad');//触发easyLoad事件
				/*结合分页插件设置分页*/
				var $pg = that.$el.find(that.options.pgApi);
				$pg.pagination($pg.data());
				/*执行callback*/
				callback && callback();
			});
		},

		/*翻页事件绑定*/
		pgEventBinding: function () {
			var that = this,
				pager = this.options.pgApi + ' a';
			/*翻页时动态加载*/
			this.$el.on('click', pager,function (event) {
				var $this = $(this);
				event.preventDefault();
				if ($this.closest('li').attr('class') && $this.closest('li').attr('class').match('disabled')) {
					return;
				}
				/*获取页码及筛选参数*/
				var page = that.getPage(this),
					params = that.getParams();
				that.loadPage($.extend({}, params, {page: page}));
			}).on('click', '.input-append .btn',function (event) {
					var $this = $(this),
						page = $this.prev('input[type=text]').val(),//页码
						params = that.getParams(),//筛选参数
						pageApi = that.$el.find(that.options.pgApi).data('pagination'),//翻页插件API
						total = pageApi.options.total;//总计页码
					/*动态加载*/
					if (page && page > 0 && page <= total) {
						that.loadPage($.extend({}, params, {page: page}));
					} else {
						alert('页码数有误！');
					}
				}).on('keydown', '.input-append input[type=text]', function (event) {
					if (event.keyCode != '13') {
						return;
					}
					var $this = $(this),
						page = $this.val(),
						params = that.getParams(),
						pageApi = that.$el.find(that.options.pgApi).data('pagination'),
						total = pageApi.options.total;
					if (page && page > 0 && page <= total) {
						that.loadPage($.extend({}, params, {page: page}));
					} else {
						alert('页码数有误！');
					}
				});
		},

		/*搜索筛选事件绑定*/
		sEventBinding: function () {
			var that = this;
			/*搜索或改变筛选条件时动态加载*/
			this.$form.on('click').on('click', 'button',function (event) {
				event.preventDefault();
				var params = that.getParams();
				that.loadPage($.extend({}, params, {page: '1'}));
			}).on('change', 'input[type=radio],input[type=checkbox]',function (event) {
					var params = that.getParams();
					that.loadPage($.extend({}, params, {page: '1'}));
				}).on('keydown', 'input', function (event) {
					if (event.keyCode == RETURN_KEY) {
						event.preventDefault();
						var params = that.getParams();
						that.loadPage($.extend({}, params, {page: '1'}));
					}
				});
		}
	};
	/* PLUGIN DEFINITION
	 * ================ */
	/**
	 * @param form: 筛选表单或者load动作参数
	 *@param options: 插件参数
	 */
	$.fn.easyLoad = function (form, options) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('easyLoad');
			options = $.extend({}, $this.data(), options);
			data || $this.data('easyLoad', (data = new EasyLoad(this, form, options)));
			var params = data.getParams(),
				exparam = {};
			/*额外传递的参数*/
			exparam[data.options.exparam] = data.options.exvalue;
			data.loadPage($.extend({}, params, exparam));
			/*如果定义form为"load"，则执行动态加载函数，不执行事件绑定*/
			form == 'load' || data.sEventBinding();
			form == 'load' || data.pgEventBinding();
		});
	};

	$.fn.easyLoad.defaults = {
		url: 'fetchData/list',//动态加载的URL
		pgApi: '[data-role=pagination]',//分页插件API
		exparam: 'page',//额外参数名
		exvalue: '1'//额外参数值
	};
	/* NO CONFLICT
	 * =========== */
	var old = $.fn.easyLoad;
	$.fn.easyLoad.noConflict = function () {
		$.fn.easyLoad = old;
		return this;
	};
	/* DEBUG
	 * ===== */
	var debug = function (error) {
		if (window.console && window.console.log) {
			console.error('jquery.easyLoad.js-' + error);
		}
	};
	/* DATA-API
	 * ======== */
	$(document).ready(function () {
		var $el = $('[data-role=easyLoad]');
		$el.each(function () {
			var $this = $(this),
				form = $this.data('form');
			$this.easyLoad(form, $this.data());
		});
	});

	/* UTILS
	 * ===== */
	/**
	 * Transfer an array[Object] to a plain object, object is expected to have attribute name and value
	 * @returns {{}} a plain object with all key-value pair in array converted to attribute name and attribute value
	 */
	var toObject = function () {
		var that = this.concat();
		var keyValuePair = {};
		var jsonObj = {};
		while (keyValuePair = that.pop()) {
			jsonObj[keyValuePair['name']] = keyValuePair['value'];
		}
		return jsonObj;
	};

	Array.prototype.toObj || (Array.prototype.toObj = toObject);

}(jQuery);