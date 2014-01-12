/*	jQuery pagination Plugin
 *	version: 1.1.0
 *	author: ZhJF
 *	email: icefox0801@hotmail.com
 *	date: 2013/04/23
 *	requires: jquery.js twitter bootstrap.css
 */
(function ($) {

	/* CLASS DEFINITION
	 * ================ */
	/**
	 * @param element: 分页元素
	 * @param options: 插件参数
	 */
 	var Pagination = function (element, options, target) {
		this.$element = $(element);
		this.$target = $(target);
		this.options = $.extend({}, $.fn.pagination.defaults, options);
		this.create(this.options);
	};

	Pagination.prototype = {
		constructor: Pagination,

		disable: function ($el) {
			$el.attr('class', 'disabled');
			$el.find('a').removeAttr('href');
			return $el;
		},

		active: function ($el) {
			$el.attr('class', 'active');
			$el.find('a').removeAttr('href');
			return $el;
		},

		/**
		 * 设置页码函数
		 * @param $el: 页码元素
		 * @param page: 页码数
		 * @param href: 链接
		 * @returns 设置页码的元素
		 */
		setPage: function ($el, page, href) {
			href = href.replace('{page}', page);
			$el.find('a').attr('href', href);
			$el.find('a').data('pageNo', page); // 为每个anchor元素的data-pageNo设置value，以便翻页时取值
			return $el;
		},

		/*创建分页函数*/
		create: function (options) {
			var page = parseInt(options.page);
			var total = parseInt(options.total);
			var length = parseInt(options.length);
			var pgArray = [];
			var href = options.href;
			try {
				pgArray = truncate(page, 1, total, length);//截取分页的页码
			} catch (e) {
				debug(e);
				return;
			}
			/*生成前后翻页元素*/
			var $prev = $('<li><a href ="">' + options.prev + '</a></li>');
			var $next = $('<li><a href ="">' + options.next + '</a></li>');
			this.$element.empty();
			/*设置向前翻页是否可用*/
			$prev = page <= 1 ? this.disable($prev) : this.setPage($prev, page - 1, href);
			this.$element.append($prev);
			/*生成分页*/
			for (var i = 0; i != pgArray.length; i++) {
				var $page = $('<li><a href="">' + pgArray[i] + '</a><li>');
				$page = pgArray[i] == page ? this.active($page) : this.setPage($page, pgArray[i], href);
				this.$element.append($page);
			}
			/*设置向后翻页是否可用*/
			$next = page >= total ? this.disable($next) : this.setPage($next, page + 1, href);
			this.$element.append($next);
		},

		/**
		 * 异步翻页函数
		 * @param url 翻页异步请求url
		 */
		ajaxPager: function(url, pageNo) {
			var that = this;
			url && $.get(url, function(data) {
				that.$target.html(data);
				that.options.page = pageNo;
				that.create(that.options);
			});
		}
	};


	/* PLUGIN DEFINITION
	 * ================ */
 	$.fn.pagination = function (options, target) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('pagination');
			if (!data) {
				$this.data('pagination', data = new Pagination(this, options, target));
			}
			else {
				data.create($.extend({}, data.options, options));
			}
			/*ajax方式翻页*/
			data.options.ajax && $this.on('click', 'a', function(event){
				var $elem = $(event.target),
					pageNo = $elem.data('pageNo');
				event.preventDefault();
				data.ajaxPager($elem.attr('href'), pageNo);
			});
		});
	};

	$.fn.pagination.defaults = {
		target: '', //翻页区域
		total: 0,//总计页码
		page: 0,//当前页码
		prev: '上一页',//向前翻页文字
		next: '下一页',//向后翻页文字
		length: 2,//中间页码左右各有的页码数
		href: 'page/{page}',//a标签的href属性，{page}是页码数的占位符
		ajax: false//是否ajax翻页
	};

	$.fn.pagination.Constructor = Pagination;

	/* NO CONFLICT
	 * =========== */
	var old = $.fn.pagination;
	$.fn.pagination.noConflict = function () {
		$.fn.pagination = old;
		return this;
	};

	/* DATA-API
	 * ======== */
	$(window).load(function () {
		$('[data-role=pagination]').each(function () {
			var $this = $(this),
				target = $this.data('target');
			$this.pagination($this.data(), target);
		});
	});

	/* DEBUG
	 * ===== */
	var debug = function (error) {
		if (window.console && window.console.log) {
			console.error('jquery.pagination.js-' + error);
		}
	};

	/* UTILS
	 * ===== */
	/**
	 * 截取分页页码的函数
	 * @param value: 当前页码数
	 * @param start: 起始页码数
	 * @param end: 总计页码数
	 * @param halfLen: 中间页码左右各有的页码数
	 * @return [Array]: 截取好的分页数组
	 */
	var truncate = function (value, start, end, halfLen) {
		if(!end) {
			throw new Error('empty page!');
		}
		
		if (start > end || value < start || value > end) {
			throw new Error('invalid arguments!');
		}
		if (!halfLen) {
			halfLen = 2;
		}
		var result = [];
		var length = 2 * halfLen + 1;
		var lOffset = value - halfLen - start;
		var rOffset = value + halfLen - end;
		var lDrift = lOffset < 0 ? lOffset : 0;
		var rDrift = rOffset > 0 ? rOffset : 0;
		var drift = lDrift + rDrift;
		value = value - halfLen - drift;
		for (var i = 0; i < length; i++) {
			if (start <= value && end >= value) {
				result.push(value);
			}
			value++;
		}
		return result;
	};
})(jQuery);