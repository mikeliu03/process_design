define(["jquery", "utils", "pd_graph_set"], function($, utils, PDGraphSet){
	/**
	 * 页面节点: new editor node
	 */
	function PDCableGraphSet(opt){
		if(this === window) return;
		this.init(opt);
	}

	PDCableGraphSet.prototype = utils.inherit(PDGraphSet.prototype);
	utils.extend(PDCableGraphSet.prototype, {
		constructor: PDCableGraphSet,
		
		name: "line_set",		// 别名

		express_is_valid: true,
		
		data: {},
		
		init_event: function(){
			var _this = this;
			var dialog = $("#dialog_line");

			this.common_init_checkbox_click("path");

			// 获取异步数据
			$.ajax({
				url: "flow.json",
				type: "get",
				data: {},
				dataType: "json",
				success: function(data){
					data = {};
					data.rspData = {
						billDetailAmount: [{key: "code001", value: "机票金额"}, {key: "code002", value: "车票金额"}, {key: "code003", value: "打车金额"}],
						billTotalAmount: [{key: "code001", value: "机票金额"}, {key: "code002", value: "车票金额"}, {key: "code003", value: "打车金额"}],
						proposerPost: [{key: "code001", value: "部门负责人"}, {key: "code002", value: "组长"}],
						proposerRank: [{key: "code001", value: "董事长"}, {key: "code002", value: "CEO"}, {key: "code003", value: "高级经理"}],
						proposerDept: [{label: "人事部", value: "人事部", _value: "1001"}, {label: "财务部", value: "财务部", _value: "1002"}, {label: "研发部", value: "研发部", _value: "1003"}]
					};
					_this._init_dialog(dialog, data.rspData);
					_this.data = data.rspData;
				}
			});

			//this.common_init_input_keyup("express");
			$(this.prefix + "express").click(function(){
				$("#dialog_line").fadeIn(200, function(){
					$(document.body).css("overflow", "hidden");
					_this.express_is_valid = true;
					$("#dialog_line_error").hide();
					$("#dialog_line .alert").addClass("status");
					var target = _this.target;
					var show_value = target.properties.node_attributes.express;
					var hidden_arr = JSON.parse(target.properties.node_attributes.express_arr || "[]");
					var dialog = $("#dialog_line");
					var express_set = $(".express-set", dialog);
					var per = null;
					var cur_line = null;

					
					express_set.html("").html($("#line_express_model").html());
					
					for(var i=0; i<hidden_arr.length; i++){
						per = hidden_arr[i];
						cur_line = $(".express-set-line", express_set).eq(i);

						$("select[name='express-name']", cur_line).val(per[0]).change();
						$("select[name='express-operate']", cur_line).val(per[1]);
						if(per[0] === "proposerDept"){
							$("input[name='express-value']", cur_line).val(per[2][0]);
						}else{
							$("select[name='express-value']", cur_line).val(per[2]);
							if($("select[name='express-value']", cur_line).val() === null){
								$("select[name='express-value']", cur_line).val("")
								$("input[name='express-value']", cur_line).val(per[2]);
							}
						}
						$("select[name='express-conect']", cur_line).val(per[3]).change();
					}

					$("#express_preview").val(show_value).data({
						hidden_arr: hidden_arr,
						show_value: show_value
					});
				});
			});
		},

		_init_dialog: function(context, data){
			var _this = this;
			var express_set = $(".express-set", context);
			var express_preview = $("#express_preview");
			
			$(context).on("change", "select[name='express-name']", function(){
				var value = this.value;
				var operate_arr = $(this.selectedOptions).data("value").split(",");
				var str = '';

				if(value){
					str = '<select class="form-common" name="express-operate"><option value="" selected="selected">请选择</option>';

					for(var i=0; i<operate_arr.length; i++){
						str += '<option value="'+operate_arr[i]+'">'+operate_arr[i]+'</option>';
					}
					str += '</select>';

					if(value === "proposerDept"){
						str += '<input type="text" name="express-value" class="form-common" style="border-left:1px solid #ddd;width:150px;" placeholder="请输入"/>';
					}else{
						str += '<select class="form-common" name="express-value"><option value="" selected="selected">请选择</option>';
						for(var i=0; i<data[value].length; i++){
						//	if(value === "billDetailAmount" || value === "billTotalAmount"){
								str += '<option value="'+data[value][i].key+'">'+data[value][i].value+'</option>';
						//	}else{
							//	str += '<option value="'+data[value][i]+'">'+data[value][i]+'</option>';
							//}
							
						}
						str += '</select>';
					}
					if(value === "billDetailAmount" || value === "billTotalAmount"){
						str += '<input type="text" class="form-common" name="express-value" placeholder="请输入">';
					}
				}

				$("select[name='express-operate'], select[name='express-value'], input[name='express-value']", $(this).parent()).remove();
				if(str) $(str).insertAfter($(this));

				if(value === "proposerDept"){
					$(this).parent().find("[name='express-value']").autocomplete({
						source: data[value],
						select: function(event, ui){
							$(this).data("data-ui", ui.item);
						},
						close: function(event, ui){
							var obj = $(this).data("data-ui")
							this.value = obj && obj.label;
							_this._update_express();
						}
					});
				}

				_this._update_express();
			});
			$(context).on("change", "select[name='express-operate']", function(){
				_this._update_express();
			});
			$(context).on("keypress", "input[name='express-value']", function(e){
				var value = +e.keyCode;
				if(e.keyCode < 48 || e.keyCode > 57) e.preventDefault();
			});
			$(context).on("keyup", "input[name='express-value']", function(e){
				if($(this).siblings("[name='express-name']")[0].selectedIndex !== 5){
					_this._update_express();
				}
			});
			$(context).on("focus", "input[name='express-value']", function(e){
				$(this).data("data-ui", null);
			});
			$(context).on("change", "select[name='express-value']", function(e){
				_this._update_express();
			});
			$(context).on("change", "select[name='express-conect']", function(e){
				var value = this.value;
				var parent = $(this).parent();

				if(!value || parent.next().length > 0){
					_this._update_express();
				}else{
					$("#line_express_model > div").clone().insertAfter(parent );
					_this._update_express();
				}
			});
			$(context).on("click", "a", function(e){
				var parent = $(this).parent();
				var siblings = parent.siblings();
				if(siblings.length > 0){
					parent.remove();
				}else{
					$("select[name='express-name']", parent).val("").change();
					$("select[name='express-conect']", parent).val("");
				}
				_this._update_express();
			});
			$("#dialog_line, #dialog_line .icon-cross").click(function(){
				$(".alert", context).removeClass("status");
				$(document.body).css("overflow", "inherit");
				context.fadeOut(200);
			});
			$(context).on("click", ".alert", function(){
				return false;
			});
			$("button", context).click(function(){
				// 验证表达式， 错误则给出提示，正确则填充
				var target = _this.target;
				var datas = $("#express_preview").data();

				// 验证
				if(!_this.express_is_valid){
					$("#dialog_line_error").show();
					return;
				}

				target.properties.node_attributes.express = datas.show_value;
				target.properties.node_attributes.express_hidden = datas.hidden_value;
				target.properties.node_attributes.express_arr = JSON.stringify(datas.hidden_arr);

				$(_this.prefix + "express").val(datas.show_value);

				$(".alert", context).removeClass("status");
				$(document.body).css("overflow", "inherit");
				context.fadeOut(200);
			});
		},

		_update_express: function(){
			var _this = this;
			var context = $("#dialog_line");
			var show_value = "";
			var hidden_value = "";
			var hidden_arr = [];
			var data = _this.data;
			var valid_arr = [];

			_this.express_is_valid = true;
			
			$(".express-set-line", context).each(function(index){
				var control = $("select[name='express-name']", this);
				var operate = $("select[name='express-operate']", this).val();
				var value_select = $("select[name='express-value']", this);
				var value_input = $("input[name='express-value']", this).val();
				var conect = $("select[name='express-conect']", this).val();
				var arr = [];
				var ui_obj = null;
				var express_is_valid = true;

				if($("input[name='express-value']", this).length > 0){
					ui_obj = $("input[name='express-value']", this).data("data-ui");
				}
				if(control.val() !== ""){
					show_value += $(control[0].selectedOptions).html();
					hidden_value += $(control[0].selectedOptions).html();
					arr.push(control.val());
					if(operate){
						show_value += "" + operate;
						//hidden_value += "" + operate === "=" ? "==" : operate;
						hidden_value += "" + operate;
						arr.push(operate);
					}else{
						express_is_valid = false;
					}
					
					if(control.val() === "proposerDept"){
						
						if(ui_obj){
							show_value += '['+ui_obj.label+']';
							hidden_value += '['+ui_obj._value+']';
							arr.push([ui_obj.label, ui_obj._value]);
						}else if(value_input){
							for(var i=0; i<data["proposerDept"].length; i++){
								if(data["proposerDept"][i].label === value_input){
									arr.push([value_input, data["proposerDept"][i]._value]);
									show_value += '['+value_input+']';
									hidden_value += '['+data["proposerDept"][i]._value+']';
									break;
								}
								if(i === data["proposerDept"].length - 1){
									express_is_valid = false;
								}
							}
						}else{
							express_is_valid = false;
						}
					}else{
						if($(value_select[0].selectedOptions).val()){
							show_value += "[" + $(value_select[0].selectedOptions).html() + "]";
							/*if(control.val() === "billDetailAmount" || control.val() === "billTotalAmount"){
								hidden_value += "" + $(value_select[0].selectedOptions).val();
							}else{
								hidden_value += "'" + $(value_select[0].selectedOptions).val() + "'";
							}*/
							hidden_value += "[" + $(value_select[0].selectedOptions).val() + "]";
							
							arr.push($(value_select[0].selectedOptions).val());
						}else if(value_input){
							show_value += "[" + value_input + "]";
							hidden_value += "[" + value_input + "]";
							arr.push(value_input);
						}else{
							express_is_valid = false;
						}
					}

					
					if(conect){
						show_value += "" + conect;
						hidden_value += "" + conect;
						arr.push(conect);
						if($(this).next().length <= 0){
							express_is_valid = false;
						}
					}else{
						if($(this).next().length > 0){
							express_is_valid = false;
						}
					}

					if(index < $(".express-set-line", context).length - 2){
						if(conect){
						}else{
							express_is_valid = false;
						}
					}
					show_value += "";
					hidden_value += "";
					hidden_arr.push(arr);
				}else{
					express_is_valid = false;
				}

				valid_arr.push(express_is_valid);
			});

			if(valid_arr.length > 0){
				for(var i=0; i<valid_arr.length; i++){
					if(!valid_arr[i]){
						_this.express_is_valid = false;
						break;
					}
				}
			}else{
				_this.express_is_valid = false;
			}

			$("#express_preview").val(show_value).data({
				show_value: show_value,
				hidden_value: hidden_value,
				hidden_arr: hidden_arr
			});
		},

		init_values: function(){
			var target = this.target;
			var source_ref = $("#" + target.sourceRef).data("target");
			var target_ref = $("#" + target.targetRef).data("target");
			var show_type = $(this.prefix + "name");
			var source_value = target_value = "";

			if(source_ref && source_ref.name === "start"){
				$(this.prefix + "path").attr("disabled", "disabled");
				$(this.prefix + "express").attr("disabled", "disabled");
			}else{
				$(this.prefix + "path").removeAttr("disabled");
				$(this.prefix + "express").removeAttr("disabled");
			}

			if(source_ref && target_ref){
				source_value = source_ref.attr(show_type);
				target_value = target_ref.name === "end" ? "结束节点" : target_ref.attr(show_type);
				if(source_value && target_value){
					show_type.val(source_value + " - " + target_value);
				}else{
					show_type.val("");
				}
			}else{
				show_type.val("");
			}

			this.common_set_checkbox_value("path");

			this.common_set_form_value("express");
		}
	});

	return PDCableGraphSet;
});