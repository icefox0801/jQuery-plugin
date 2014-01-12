/**
 * jquery-easyForm Plugin
 * version: 1.0.0
 * Author: ZhJF
 * Email: icefox0801@hotmail.com
 * Time: 2013/05/06
 * Requires: jquery.js
 */

!function ($) {
	/* CLASS DEFINITION
	 * ================ */
	var EasyForm = function (element, form, options) {
		this.$element = $(element);
		this.$form = $(form);
		this.options = $.extend({}, $.fn.easyForm.defaults, options);
	};

	EasyForm.prototype = {
		constructor: EasyForm,

		setFormAttr: function () {
			var action = this.options.action,
				method = this.options.method;
			action && this.$form.attr('action', action);
			method && this.$form.attr('method', method);
		},

		setDisabled: function () {
			var disabled = [],
				$inputor = this.$form.find('[name]'),
				result = [];
			this.options.disabled && (disabled = this.options.disabled.split(' '));
			$inputor.each(function () {
				for (var i = 0; i < disabled.length; i++) {
					disabled[i] == this.name && (this.disabled = 'disabled');
					result.push(disabled[i]);
					break;
				}
			});
			return result;
		},

		setEnabled: function(result) {
			for(var i = 0; i < result.length; i++){
				var selector = '[name=' + result[i] + ']';
				this.$form.find(selector).attr('disabled', false);
			}
		}
	};

	/* PLUGIN DEFINITION
	 * ================ */
	$.fn.easyForm = function (options) {
		return this.each(function () {
			var that = this,
				$this = $(this),
				form = $this.closest('form').get(),
				data = $this.data('easyForm');
			options = $.extend({}, $this.data(), options);
			data || $this.data('easyForm', (data = new EasyForm(this, form, options)));
			data.$element.on(data.options.event, function () {
				data.setFormAttr();
				var result = data.setDisabled();
				if (data.options.ajax) {
					that.type = 'button';
					$.ajax(data.options.action, {type : data.options.method, data: data.$form.serialize()});
					data.setEnabled(result);
				} else {
					data.$form.submit();
				}
			});
		});
	};

	$.fn.easyForm.defaults = {
		event: 'click.easyForm',
		method: 'POST',
		ajax: false
	};

	$.fn.easyForm.Constructor = EasyForm;

	/* NO CONFLICT
	 * =========== */
	var old = $.fn.easyForm;

	$.fn.easyForm.noConflict = function () {
		$.fn.easyForm = old;
		return this;
	}

	/* DEBUG
	 * ===== */
	var debug = function (error) {
		if (window.console && window.console.log) {
			console.error('jquery.easyForm.js-' + error);
		}
	};

	/* DATA-API
	 * ======== */
	$(window).on('load', function () {
		var $btn = $('[data-role=easyForm]');
		$btn.each(function () {
			var $this = $(this);
			$this.easyForm($this.data());
		})
	});

	/* UTILS
	 * ===== */

}(jQuery);