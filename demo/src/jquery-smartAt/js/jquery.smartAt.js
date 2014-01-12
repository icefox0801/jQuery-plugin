/*	jQuery smartAt Plugin
 *	version: 1.1.0
 *	author: ZhJF
 *	email: icefox0801@hotmail.com
 *	date: 2013/04/18
 *	requires: jquery.js
 */
(function ($) {

	/* CLASS DEFINITION
	 * ================ */
	/**
	 * @param group: 选择@的checkbox组
	 * @param target: 插入@的文本输入区域
	 * @param options: 插件参数
	 */
	var SmartAt = function (group, target, options) {
		this.$group = $(group).find('input[type=checkbox]');
		this.$target = $(target);
		this.options = $.extend({}, $.fn.smartAt.defaults, options);
		/*通过options.split分隔符的不同，定义不同的匹配@字符串的正则匹配表达式*/
		switch (this.options.split) {
			case ' ':
			{
				this.regExp = /^(@[\w\u4e00-\u9fa5-]+[\s:：])+/ig;
				break;
			}
			case ',':
			{
				this.regExp = /^(@[\w\u4e00-\u9fa5-]+[,，:：])+/ig;
				break;
			}
			case ';':
			{
				this.regExp = /^(@[\w\u4e00-\u9fa5-]+[;；:：])+/ig;
				break;
			}
			default :
				break;
		}
	};

	SmartAt.prototype = {
		constructor: SmartAt,

		/*获取要@value的函数*/
		getValue: function ($element) {
			var value = '';
			var valueTag = this.options.valueTag;
			/*根据不同valueTag类型获取value*/
			switch (valueTag) {
				case 'label':
				{
					value = $element.closest('label').text().trim();
					break;
				}
				case 'checkbox':
				{
					value = $element.val();
					break;
				}
				default :
					break;
			}
			return value;
		},

		/*获取选中checkbox的value并合并到一起*/
		getChecked: function () {
			var that = this,
				checkedArray = [];
			this.$group.each(function () {
				var $this = $(this);
				this.checked && checkedArray.push('@' + that.getValue($this));
			});
			return checkedArray;
		},

		/**
		 * 根据文本输入区域的@字符串设置group的选中状态
		 * @param atVal: 文本输入区域@字符串
		 */
		setChecked: function (atVal) {
			var that = this;
			this.$group.each(function () {
				var $this = $(this),
					regVal = eval('/@' + that.getValue($this) + '[' + that.options.split + ':：]/ig');//生成匹配一个@的正则表达式
				this.checked = atVal.match(regVal) ? true : false;
			});
		},

		/**
		 * 从文本输入区域获取@字符串和内容
		 * @returns {Object}: toAt属性是文本输入区域的@字符串，content是@字符串后面的内容
		 */
		getText: function () {
			var text = this.$target.val();
			var toAt = '';
			text && text.match(this.regExp) && (toAt = text.match(this.regExp)[0]);
			var content = text.replace(toAt, '');
			return {toAt: toAt, content: content};
		},

		/**
		 * 通过@value的数组向文本输入区域添加@value
		 * @param array:@value的数组
		 */
		setTextAt: function (array) {
			var split = this.options.split;
			var textObj = this.getText();
			var atVal = '';
			array.length && (atVal = array.join(split) + ':');
			this.$target.val(atVal + textObj.content);
			this.options.autoFocus && this.$target.focus();
		}
	};

	/* PLUGIN DEFINITION
	 * ================ */
	$.fn.smartAt = function (target, options) {
		var $target = $(target),
			targetData = $target.data('smartAt');
		targetData || $target.data('smartAt', new SmartAt(this, target, options));
		return this.each(function () {
			var $this = $(this),
				data = $this.data('smartAt');
			data || $this.data('smartAt', data = new SmartAt(this, target, options));
			/*group中checkbox的change事件绑定，改变checkbox选中状态时改变文本输入区域的@字符串*/
			$this.on('change', function () {
				var $this = $(this);
				var data = $this.data('smartAt');
				var checkedArray = data.getChecked();
				data.setTextAt(checkedArray);
			});
			/*文本输入区域的输入事件绑定，向文本输入区域输入或获得焦点时改变checkbox的选中状态*/
			$target.on('keyup',function (e) {
				var $this = $(e.target);
				var data = $this.data('smartAt');
				var atVal = data.getText().toAt;
				data.setChecked(atVal);
			}).focus(function (e) {
				var et = e.target;
				et.selectionStart = et.selectionEnd = et.textLength;
			});
		});
	};

	$.fn.smartAt.defaults = {
		valueTag: 'label',
		autoFocus: true,
		split: ' '
	};

	$.fn.smartAt.Constructor = SmartAt;

	/* NO CONFLICT
	 * =========== */
	var old = $.fn.smartAt;
	$.fn.smartAt.noConflict = function () {
		$.fn.smartAt = old;
		return this;
	};

	/* DATA-API
	 * ======== */
	$(window).on('load', function () {
		$('[data-role=smartAt]').each(function () {
			var $this = $(this);
			var target = $this.data('target');
			$this.smartAt(target, $this.data())
		})
	});

	/* DEBUG
	 * ===== */
	var debug = function (error) {
		if (window.console && window.console.log) {
			console.error('jquery.easyForm.js-' + error);
		}
	};

	/*UTILS*/
	/*IE7,8 trim fix*/
	var trimFix = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
	String.prototype.trim || (String.prototype.trim = trimFix);

})(jQuery);
