define(["jquery"], function ($) {
    /**
     * 页面节点: new editor node
     */
    function PDGraphSet() {
    }

    PDGraphSet.prototype = {
        constructor: PDGraphSet,

        dom: null,				// 与设置对象绑定的DOM对象

        target: null,			// 当前正在设置的对象

        parent: $("#settings"),

        prefix: "",

        /**
         * 初始化方法
         */
        init: function (opt) {
            for (var i in opt) {
                if (this[i] !== undefined) {
                    this[i] = opt[i];
                }
            }

            this.dom = $("#" + this.name);
            this.prefix = "#" + this.name + "_";

            // 样式初始化
            this.init_style();

            // 事件初始化
            this.init_event();

            // 绑定对象
            $(this.dom).data("target", this);
        },

        /**
         * 初始化事件
         */
        init_event: function () {
        },

        /**
         * 初始化样式
         */
        init_style: function () {
        },

        /**
         * 显示设置对象
         */
        show: function (target) {
            var _this = this;
            this.target = target;
            this.init_values();
            // 控制面板

        },

        /**
         * 初始化当前设置的对象的值
         */
        init_values: function () {
        },

        /**
         * 通用 input keyup 事件
         */
        common_init_input_keyup: function (subfix) {
            var _this = this;
            $(_this.prefix + subfix).keyup(function (e) {
                _this.target.attr(this, $.trim(this.value));
                if (_this.target.name === "task" && subfix === "name") {
                    $("tspan", _this.target.dom).html($.trim(this.value));
                }
            });
			
			if(subfix === "sign"){
				$(_this.prefix + subfix).keypress(function(e){
					var code = +e.keyCode;
					if(code >= 48 && code <= 57){}else{
						return false;
					}
				});
			}
        },

        /**
         * 通用 dropdown change 事件
         */
        common_init_select_change: function (subfix) {
            var _this = this;
            $(_this.prefix + subfix).change(function () {
                _this.target.attr(this, this.value);
				if(subfix === "pattern"){
					if(this.value === "1"){
						$(_this.prefix + "sign").closest(".flex").removeClass("hide");
					}else{
						$(_this.prefix + "sign").closest(".flex").addClass("hide");
					}
				}
            });
        },

        /**
         * 通用 checkbox click 事件
         */
        common_init_checkbox_click: function (subfix) {
            var _this = this;
            $(_this.prefix + subfix).click(function () {
                _this.target.attr(this, this.checked ? "000" : "001");
            });
        },

        /**
         * 通用模拟checkbox插件初始化
         */
        common_init_slidebar: function (subfix) {
            var _this = this;
            $(_this.prefix + subfix).click(function () {
                $(this).toggleClass("checked");
                _this.target.attr(this, $(this).hasClass("checked") ? "000" : "001");
                return false;
            });
        },

        common_set_form_value: function (subfix) {
            var element = $(this.prefix + subfix);
            element.val(this.target.attr(element));
			if(subfix === "pattern"){
				if(element.val() === "1"){
					$(this.prefix + "sign").closest(".flex").removeClass("hide");
				}else{
					$(this.prefix + "sign").closest(".flex").addClass("hide");
				}
			}
        },

        common_set_checkbox_value: function (subfix) {
            var element = $(this.prefix + subfix);
            element[0].checked = this.target.attr(element) === "000";
        },

        common_set_slidebar_value: function (subfix) {
            var element = $(this.prefix + subfix);
            if (this.target.attr(element) === "000") {
                element.addClass("checked");
            } else {
                element.removeClass("checked");
            }
        },


        /**
         * 销毁设置对象
         */
        destroy: function () {
            $(this.dom).removeData().remove();
            this.dom = null;
            this.target = null;
        }
    };

    return PDGraphSet;
});