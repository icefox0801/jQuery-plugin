/**
 * jquery-chkMerge Plugin
 * version: 1.1.0
 * Author: ZhJF
 * Email: icefox0801@hotmail.com
 * Time: 2013/05/04
 * Requires: jquery.js
 */

!function ($) {
	/* CLASS DEFINITION
	 * ================ */
	/**
	 * @param elem: 合并选中checkbox值的元素，比如一个隐藏的input
	 * @param options: 插件参数
	 */
	var ChkMerge = function (elem, options) {
		this.options = $.extend({}, $.fn.chkMerge.defaults, options);
		this.$elem = $(elem);
		this.$form = this.$elem.closest('form');//设置表单为元素所在的form
	};

	ChkMerge.prototype = {
		constructor: ChkMerge,

		/*设置合并value的group*/
		setGroup: function () {
			var $group = $(this.options.group);
			if($group.length == 0) throw new Error('the checkbox group is not defined!');
			/*如果参数中的group非input元素，则在group中寻找input元素，并设置为group*/
			if (!$group[0].tagName.match(/^input$/ig)) {
				switch (this.options.valuetag) {
					case 'text':
					{
						$group = $group.find('input[type=text],input');
						group = $group.get();
						break;
					}
					case 'checkbox':
					case 'label':
					{
						$group = $group.find('input[type=checkbox]');
						group = $group.get();
						break;
					}
					default:
						break;
				}
				this.$group = $(group);
			} else {
				this.$group = $group;
			}
		},

		/*事件绑定函数，当事件触发时，合并group中的value*/
		fEventBinding: function ($elem) {
			var that = this;
			/*为每一个表单分配一个唯一的class，使每一个submit事件都能对应相应的表单（如果没定义触发元素）*/
			if (!this.options.event || this.options.event == 'submit' && !this.options.trigger) {
				var count = $('[class*=chkMerge-form]').length,
					clsName = 'chkMerge-form' + (count + 1),
					clsConflict = this.$form.attr('class') && this.$form.attr('class').match('chkMerge-form');
				clsConflict && (clsName = 'chkMerge-form' + count);
				clsConflict || (this.$form = this.$form.addClass(clsName));
				var triggerCls = '.' + clsName;
				this.options.trigger = triggerCls;
			}
			this.options.trigger || debug(new Error('Unexpected form selector, define an id or class attribute instead!'));
			/*事件绑定，当定义的options.trigger元素触发options.event事件时，合并value*/
			$(document).on(this.options.event, this.options.trigger, function(event) {
				that.setGroup();
				var $this = $(this),
					e = $.Event('merge'),//触发merge事件
					valObj = that.mergeValue();
				that.options.valuetag == 'text' ? $elem.val(valObj['unchecked']) : $elem.val(valObj[that.options.ref]);
				$this.trigger(e);
			});
		},

		/**
		 * 取value函数
		 * @param elem:取value的元素
		 * @returns {String}:取得的value
		 */
		getValue: function (elem) {
			var $elem = $(elem);
			var value = '';
			var valueTag = this.options.valuetag;
			/*通过options.valuetag判断是哪一种类型的元素，再用相应的方法取得value*/
			switch (valueTag) {
				case 'label'://如果是label，取label中的text
				{
					value = $elem.closest('label').text().trim();
					break;
				}
				case 'checkbox'://如果是input[type="checkbox"]，取它的data-value属性
				{
					value = $elem.data('value') || $elem.val();
					break;
				}
				case 'text'://如果是input[type="text"]，取它的value
				{
					$elem.val() && (value = $elem.val());
					break;
				}
				default :
					break;
			}
			return value;
		},

		/**
		 * 合并value函数
		 * @returns {Object}:合并后的对象，有checked和unchecked两个属性
		 */
		mergeValue: function () {
			var that = this,
				mergeObj = {},
				checkedArr = [],
				uncheckedArr = [],
				split = this.options.split;
			/*遍历group的元素，把取得的value加到checked和unchecked两个数组中*/
			this.$group.each(function () {
				var value = that.getValue(this);
				that.options.valuetag == 'text' || this.checked ? checkedArr.push(value) : uncheckedArr.push(value);
				/*如果从input[type="text"]中取value，则加到unchecked数组中*/
				that.options.valuetag == 'text' && value && uncheckedArr.push(value);
			});
			mergeObj.checked = checkedArr.join(split);
			mergeObj.unchecked = uncheckedArr.join(split);
			return mergeObj;
		},
		
		/*将合并后的值赋给$elem*/
		setMerged: function() {
			this.setGroup();
			var e = $.Event('merge'),
				valObj = this.mergeValue();
			this.options.valuetag == 'text' ? this.$elem.val(valObj['unchecked']) : this.$elem.val(valObj[this.options.ref]);
			this.$elem.trigger(e);//触发merge事件
		}
	};

	/* PLUGIN DEFINITION
	 * ================ */
	var old = $.fn.chkMerge;

	/**
	 * @param options: 插件参数
	 * @param merge: 合并动作
	 */
	$.fn.chkMerge = function (options, merge) {
		return this.each(function () {
			var $this = $(this),
				data = $this.data('chkMerge');
			/*如果options为String类型，那么说明是$(el).checkAll(options)用法*/
			(typeof options === 'string') && (options = { group: options });
			/*如果merge定义为false则合并unchecked0*/
			if(merge === false || merge === 'unchecked') {
				merge = undefined;
				options.ref = 'unchecked';
			}
			options = $.extend({}, $this.data, options);
			data || $this.data('chkMerge', (data = new ChkMerge(this, options)));
			/*未定义merge时则绑定事件，事件触发时合并value*/
			merge || data.fEventBinding($this);
			/*定义merge为"merge"时，则执行合并value函数*/
			merge == 'merge' && data.setMerged();
		});
	};

	$.fn.chkMerge.defaults = {
		split: ',',//合并后的分隔符
		valuetag: 'checkbox',//取value的元素类型，可以为text、label、checkbox
		ref: 'checked',//取所有选中的合并后的value或者未选中的，如果valuetag是text，默认为合并到unchecked中，该项无效
		event: 'submit',//事件
		trigger: ''//触发元素
	};

	/* NO CONFLICT
	 * =========== */
	$.fn.chkMerge.noConflict = function () {
		$.fn.chkMerge = old;
		return this;
	}

	/* DEBUG
	 * ===== */
	var debug = function (error) {
		if (window.console && window.console.log) {
			console.error('jquery.chkMerge.js-' + error);
		}
	};

	/* DATA-API
	 * ======== */
	$(window).on('load', function () {
		$('[data-role=chkMerge]').each(function () {
			var $this = $(this);
			$this.chkMerge($this.data());
		});
	});

	/* UTILS
	 * ===== */
	/*IE7,8 trim fix*/
	var trimFix = function() {
		return this.replace(/(^\s*)|(\s*$)/g, "");
	};
	String.prototype.trim || (String.prototype.trim = trimFix);
	
}(jQuery);
