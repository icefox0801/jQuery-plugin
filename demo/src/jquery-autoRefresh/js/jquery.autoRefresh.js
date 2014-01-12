/**
 * jquery-autoRefresh Plugin
 * version: 1.1.0
 * Author: ZhJF
 * Email: icefox0801@hotmail.com
 * Time: 2013/04/19
 * Requires: jquery.js bootstrap.css
 */

!function ($) {
	/* CLASS DEFINITION
	 * ================ */
	/**
	 * @author icefox
	 * @param elem: 绑定自动刷新的元素
	 * @param target: 自动刷新区域
	 * @param options: 插件参数
	 * @constructor
	 */
	var AutoRefresh = function (elem, target, options) {
		this.$elem = $(elem); //定义绑定自动刷新的jQuery对象
		this.$target = $(target);//定义自动刷新区域的jQuery元素
		this.options = $.extend(true, {}, $.fn.autoRefresh.defaults, options);
		this.$switchor = this.$elem.find(this.options.switchor);//定义自动刷新的开关

		if (!this.$switchor.length) {
			throw new Error('no switchor defined!');
		}


		if (this.options.interval.match(/\d{1,4}/ig)) {
			this.interval = this.options.interval;
		}//定义自动刷新的时间间隔
		else {
			this.$interval = $(this.options.interval);
			this.interval = this.$interval.val();
		}//定义控制自动刷新的时间间隔的jQuery对象
		this.interval || (this.interval = '30');//未定义时间间隔jQuery对象，则刷新间隔默认为30秒
		this.countDown = this.interval;//自动刷新倒计时，初始设定为刷新间隔
	};

	AutoRefresh.prototype = {
		constructor: AutoRefresh,

		/*循环刷新的函数*/
		loop: function () {
			var that = this;

			/*如果倒计时为0，则获取新的条目添加到列表的前面，否则倒计时减1*/
			if (!this.countDown) {
				/*获取id做为传给服务器的参数*/
				var id = this.$target.find(this.options.selector + ':first').attr('id'),
					params = {type: 'latest', id: id};
				this.load(params, 'prepend');
				/*重置倒计时*/
				this.countDown = this.interval;
			} else {
				this.setCdText(this.countDown);
				this.countDown = this.countDown - 1;
			}
		},

		/*设置倒计时文字*/
		setCdText: function (time) {
			if (!this.options.countDown) {
				return;
			}
			/*获取或者添加显示倒计时文字的jQuery元素*/
			var $cd = this.$elem.find('.a-cd');
			$cd.length || ($cd = $('<span class="a-cd"></span>').appendTo(this.$elem));
			$cd.text(' ' + time + '秒后刷新..');
		},

		/*设置刷新间隔*/
		setInterval: function (interval) {
			this.interval = interval;
			this.countDown = interval;
		},

		/*开始倒计时*/
		start: function () {
			var that = this;
			/*确保loop方法执行时this指向插件本身而不是window对象*/
			$.timers.push(setInterval($.proxy(this.loop, that), 1000));
		},

		/*暂停倒计时*/
		pause: function () {
			clearInterval($.timers.pop());
		},

		/*滚动事件绑定*/
		scrollEventBinding: function (e) {
			var height = e.target.scrollHeight,
				visibleHeight = e.target.offsetHeight,
				hiddenHeight = e.target.scrollTop;
			var scrollBottom = height - visibleHeight - hiddenHeight;
			/*如果滚动条距底端小于30px时，加载新条目*/
			if (scrollBottom < 30) {
				/*获取id做为传给服务器的参数*/
				var id = this.$target.find(this.options.selector + ':last').attr('id'),
					params = {type: 'earliest', id: id};
				this.load(params, 'append');
			}
		},

		/**
		 *
		 * @param params: 传递给服务器的参数
		 * @param attach: 内容添加的位置，prepend或者append
		 */
		load: function (params, attach) {
			var that = this,
				text = '',
				$ltext = {},
				$div = $('#a-hdiv'),
				e = $.Event('refresh'),//refresh事件定义
				callback = function (e) {
					var $this = $(this),
						content = $this.html().trim(' ');
					switch (attach) {
						case 'prepend':
						{
							that.$target.prepend($this.html());
							break;
						}
						case 'append':
						{
							that.$target.append($this.html());
							break;
						}
						default:
							break;
					}
					/*如果加载到的内容为空，解绑滚动事件，避免向服务器重复发送无用请求*/
					if (!content.length && attach == 'append') {
						that.$target.off('scroll.load');
					} else {
						$ltext.length && $ltext.html(text);
					}
					$this.empty();
				};
			/*生成一个隐藏的div暂存加载到内容*/
			$div.length || ($div = $('<div id="a-hdiv" style="display:none"></div>').appendTo('body'));
			this.$elem.trigger(e);//触发刷新事件

			/*easyLoad插件接口*/
			if (this.options.easyloadapi) {
				var data = $(this.options.easyloadapi).data('easyLoad');
				this.options.load && $div.load(this.options.url, $.extend({}, data.getParams(), params), callback);
			}
			else {
				$div.load(this.options.url);
			}
		}
	};

	/* PLUGIN DEFINITION
	 * ================ */
	var old = $.fn.autoRefresh;

	/**
	 * @param target: 自动刷新区域
	 * @param options: 插件参数
	 */
	$.fn.autoRefresh = function (target, options) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('autoRefresh');
			options = $.extend({}, $this.data(), options);
			try {
				data || $this.data('autoRefresh', (data = new AutoRefresh(this, target, options)));
			} catch (e) {
				debug(e);
			}
			/*开关自动刷新的事件绑定*/
			data.$switchor.on('change', function (e) {
				return this.checked == false ? data.pause() : data.start();
			});
			/*改变刷新间隔的事件绑定*/
			data.$interval.length && data.$interval.on('change', function (e) {
				data.setInterval(this.value);
			});
			/*滚动加载的事件绑定*/
			data.options.scrollLoad && data.$target.off('scroll.load').on('scroll.load', $.proxy(data.scrollEventBinding, data));
			/*如果定义了easyLoad插件的api，easyLoad事件触发后要重新绑定滚动加载事件*/
			data.options.easyloadapi && $(document).on('easyLoad', data.options.easyloadapi, function () {
				data.$target.off('scroll.load').on('scroll.load', $.proxy(data.scrollEventBinding, data));
			});
			/*页面加载后是否开始自动刷新*/
			data.options.refreshOnStart && data.start();
		});
	};

	$.fn.autoRefresh.defaults = {
		switchor: '.a-sw',//自动刷新开关
		interval: '.a-intvl',//自动刷新时间间隔，未定义间隔默认为30秒
		countDown: true,//是否显示倒计时文字
		url: '',//自动刷新时向服务器请求的url
		load: true,//是否以ajax方式自动刷新
		easyloadapi: '', //绑定easyLoad插件元素，一般为AutoRefresh方法的target参数
		selector: 'li .box-answer', //获取post参数id的元素
		scrollLoad: true,//滚动加载
		refreshOnStart: true//页面加载后是否开始自动刷新
	};

	/* NO CONFLICT
	 * =========== */
	$.fn.autoRefresh.noConflict = function () {
		$.fn.autoRefresh = old;
		return this;
	};

	/* DATA-API
	 * ======== */
	$(window).on('load', function () {
		$('[data-role*=autoRefresh]').each(function () {
			var $this = $(this),
				data = $this.data(),
				target = $this.data('target');
			$this.autoRefresh(target, $this.data());
		});
	});

	/* DEBUG
	 ===== */
	var debug = function (error) {
		if (window.console && window.console.log) {
			console.error('jquery.autoRefresh.js-' + error);
		}
	};

	/* UTILS
	 * ===== */
	/*IE7,8 trim fix*/
	var trimFix = function () {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
	String.prototype.trim || (String.prototype.trim = trimFix);

}(jQuery);