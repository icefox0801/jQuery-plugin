/*	jQuery smartTag Plugin
 *	version: 1.0.0
 *	author: ZhJF
 *	email: icefox0801@hotmail.com
 *	date: 2013/05/15
 *	requires: jquery.js bootstrap.css
 */
(function($) {

	/* CLASS DEFINITION 
	 * ================ */
	var SmartTag = function(element, target, options) {
		this.options = $.extend({}, $.fn.smartTag.defaults, options);
		this.$element = $(element);
		this.$target = $(target);
	};

	SmartTag.prototype = {
		constructor : SmartTag,

		/*初始化备选标签区域函数*/
		initOptions : function() {
			var that = this, items = this.options.dataSource, $lbs = this.$target.find(this.options.tagsOption);
			var $opts = this.$element.find(this.options.tagsOption);
			/*生成备选标签组*/
			$opts.each(function() {
				var $opt = $(this);
				$lbs.each(function() {
					var $this = $(this);
					$opt.text().trim() == $this.text().trim() && $opt.remove();
				});
			});
		},

		/*获取标签值*/
		getValue : function(elem) {
			/*判断从elem本身还是外层label获取value*/
			if (!elem.tagName.match(/^I$/ig)) {
				return $(elem).text().trim();
			} else {
				var $elem = $(elem).closest('.label');
				return $elem.text().trim();
			}
		},

		/*添加标签函数*/
		addTag : function(elem) {
			var $elem = $(elem), 
				value = $elem.text().trim();
			$elem.remove();//将标签从备选组中移除
			this.$target.append($elem);//将标签添加到标签组
		},

		/*移除标签函数*/
		removeTag : function(elem) {
			var $elem = $(elem).closest(this.options.tagsOption), value = $elem.text().trim();
			$elem.remove();
			this.$element.append($elem);
		},

		/** 
		 * 添加标签时向服务器发送请求的函数
		 * @param target: 标签组
		 * @param params: 发送的参数
		 * @param callback: 请求成功后执行的函数 
		 */
		addRequest : function(target, params, callback) {
			var that = this, 
				path = this.options.add;
			path && $.post(path, params, function(result) {
				result.success == true && that.addTag(target);
				callback && callback();
			}, 'json');
		},

		/**
		 * 移除标签时向服务器发送请求的函数
		 * @param target: 标签组
		 * @param params: 发送的参数
		 * @param callback: 请求成功后执行的函数
		 */
		removeRequest : function(target, params, callback) {
			var that = this, 
				path = this.options.remove;
			path && $.post(path, params, function(result) {
				result.success == true && that.removeTag(target);
				callback && callback();
			}, 'json');
		},

		/*事件绑定函数*/
		eventBinding : function() {
			var that = this;
			/*添加标签事件绑定*/
			this.$element.off('click').on('click', 'button', this.options.tagsOption, function(event) {
				var value = that.getValue(this),
					target = $(event.target);
				that.addRequest(target, {
					tag : value
				});
			});
			/*移除标签事件绑定*/
			this.$target.off('click').on('click', 'button', function(event) {
				var value = that.getValue(this),
					target = $(event.target);
				that.removeRequest(target, {
					tag : value
				});
			});
		}
	};

	/*  PLUGIN DEFINITION 
	 * ================ */
	var old = $.fn.smartTag;

	$.fn.smartTag = function(target, options) {
		return this.each(function() {
			var $this = $(this), data = $this.data('smartTag');
			options = $.extend({}, $this.data(), options);
			data || $this.data('smartTag', (data = new SmartTag(this, target, options)));
			data.initOptions();
			data.eventBinding();
		});
	};

	$.fn.smartTag.defaults = {
		tagsOption : '.smartTag',//备选标签组
		ajax : 'true',//是否ajax请求
		type : 'post',//请求方式
		remove : '',//移除标签请求路径
		add : ''//添加标签请求路径
	};

	$.fn.smartTag.Constructor = SmartTag;

	/* NO CONFLICT 
	 * =========== */
	$.fn.smartTag.noConflict = function() {
		$.fn.smartTag = old;
		return this;
	};

	/* DEBUG 
	 * ===== */
	var debug = function(error) {
		if (window.console && window.console.log) {
			console.error('jquery.smartTag.js-' + error);
		}
	};

	/*  DATA-API
	 *  ======== */
	$(window).on('load', function() {
		$('[data-role=smartTag]').each(function() {
			var $this = $(this);
			$this.smartTag($this.data('target'), $this.data());
		});
	});
	$(window).on('easyLoad', function() {
		$('[data-role=smartTag]').each(function() {
			var $this = $(this),
				data = $this.data('smartTag');
			data || $this.smartTag($this.data('target'), $this.data());
		});
	});

	/* UTILS 
	 * ===== */
	/* IE7,8 trim fix */
	var trimFix = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
	String.prototype.trim || (String.prototype.trim = trimFix);

})(jQuery);
