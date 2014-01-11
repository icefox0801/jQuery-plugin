/**
 * jquery-checkAll Plugin
 * version: 1.0.1
 * Author: ZhJF
 * Email: icefox0801@hotmail.com
 * Date: 2013/05/03
 * Requires: jquery.js
 */

!function ($) {
	/* CLASS DEFINITION
	 * ================ */
	/**
	 * @param element: 控制全选的checkbox或者checkbox外的label元素
	 * @param options: 插件参数
	 */
	var CheckAll = function (element, options) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.checkAll.defaults, options);
	};

	CheckAll.prototype = {
		constructor: CheckAll,

		/*如果所有的checkbox都处于选中状态，则设置全选checkbox为选中状态，否则则设置为未选中状态*/
		setChecked: function (e) {
			var $group = $(this.options.group);
			$group[0].type == 'checkbox' || ($group = $group.find('input[type=checkbox]'));
			var isChecked = e.target.checked;
			$group.each(function () {
				this.disabled || (this.checked = isChecked);
			});
			this.$group = $group;
		},

		/*通过全选chechbox来全选一组checkbox*/
		setCheckAll: function (e) {
			var $group = $(this.options.group),
				isChecked = true;
			$group[0].type == 'checkbox' || ($group = $group.find('input[type=checkbox]'));
			for (var i = 0; i < $group.length; i++) {
				isChecked = isChecked && $group[i].checked;
			}
			this.$element[0].checked = isChecked;
		},

		/*显示选中的checkbox的数目*/
		count: function () {
			var  $group = $(this.options.group),
				count = 0,
				$count = $(this.options.countElem),
				countText = this.options.countText;
			$group.each(function () {
				this.checked && count++;
			});
			$count.length || ($count = $('<span id="count"></span>')).appendTo('body');
			countText = countText.replace('{count}', count.toString());
			$count.text(countText);
		}
	};

	/* PLUGIN DEFINITION
	 * ================ */
	var old = $.fn.checkAll;

	$.fn.checkAll = function (options) {
		return this.each(function () {
			var $this = $(this), data = $this.data('checkAll');
			/*如果options为String类型，那么说明是$(el).checkAll(options)用法*/
			(typeof options === 'string') && (options = { group: options });
			options = $.extend({}, $this.data(), options);
			data || $this.data('checkAll', (data = new CheckAll(this, options)));
			options.count && data.count();
			/*事件绑定*/
			$this.on('change.checkAll', $.proxy(data.setChecked, data));
			$(document).on('change.checkAll', data.options.group + ' input[type=checkbox]', $.proxy(data.setCheckAll, data));
			options.count && $this.on('change.checkAll', $.proxy(data.count, data));
			options.count && $(group).on('change.checkAll', 'input[type=checkbox]', $.proxy(data.count, data));
		});
	};

	$.fn.checkAll.defaults = {
		count: false,//是否启动计数
		countElem: '#count',//计数元素
		countText: '{count} options are checked'//计数文字
	};

	/* NO CONFLICT
	 * =========== */
	$.fn.checkAll.noConflict = function () {
		$.fn.checkAll = old;
		return this;
	};

	/* DEBUG
	 * ===== */
	var debug = function (error) {
		if (window.console && window.console.log) {
			console.error('jquery.checkAll.js-' + error);
		}
	};

	/* DATA-API
	 * ======== */
	$(window).on('load', function (e) {
		$('[data-role=checkAll]').each(function () {
			var $this = $(this);
			$this.checkAll($this.data());
		});
	});

	/* UTILS
	 * ===== */

}(jQuery);
