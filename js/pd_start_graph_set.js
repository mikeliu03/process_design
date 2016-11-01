define(["jquery", "utils", "pd_graph_set"], function($, utils, PDGraphSet){
	/**
	 * 页面节点: new editor node
	 */
	function PDStartGraphSet(opt){
		if(this === window) return;
		this.init(opt);
	}

	PDStartGraphSet.prototype = utils.inherit(PDGraphSet.prototype);
	utils.extend(PDStartGraphSet.prototype, {
		constructor: PDStartGraphSet,
		
		name: "start_set",		// 别名
		
		name_arr: [],

		init_event: function(){
			var _this = this;
			var dialog = $("#dialog_start");
			// 获取异步数据
			/*$.ajax({
				url: "flow.json",
				type: "get",
				data: {},
				dataType: "json",
				success: function(data){
					data = {};
					data.rspData = {
						people: [{key: "张三", value: "1001"}, {key: "李四", value: "1002"}, {key: "王五", value: "1003"}],
						organization: ["凯润星云网络技术有限公司", "研发部", "产品部", "财务部"],
						post: ["CEO", "CTO", "部门主管"],
						job: ["董事长", "CEO", "高级经理", "项目经理", "产品经理"],
						role: ["测试流程角色名", "开发流程角色名", "需求流程角色名"],
						creator: ["曹操", "关羽", "刘备", "张飞", "孙权", "诸葛亮"]
					};
					_this._init_dialog(dialog, data.rspData);
				}
			});*/

			$("#start_set .site-title, #start_set .common-table-title").click(function(){
				$(this).next().toggle();
				$(this).addClass("site-title").removeClass("common-table-title");
				if($(this).next().css("display") === "none"){
					$(this).find("span").addClass("icon-maximize").removeClass("icon-minimize");
				}else{
					$(this).find("span").removeClass("icon-maximize").addClass("icon-minimize");
				}
				$(this).parent().siblings().each(function(){
					$(this).children().first().addClass("common-table-title").removeClass("site-title").find("span").addClass("icon-maximize").removeClass("icon-minimize");
					$(this).children().last().hide();
				});
			});

			this.common_init_input_keyup("name");
			this.common_init_select_change("executor");
			this.common_init_input_keyup("express");
			/*$(this.prefix + "express").click(function(){
				$("#dialog_start").fadeIn(200, function(){
					$("#dialog_start .alert").addClass("status");
					var target = _this.target;
					var show_value = target.properties.node_attributes.executor;
					var hidden_arr = JSON.parse(target.properties.node_attributes.executor_arr || "[]");
					var dialog = $("#dialog_start");
					var express_set = $(".express-set", dialog);
					var per = null;
					var cur_line = null;

					$("#express_preview").val(show_value);
					express_set.html("").html($("#start_express_model").html());
					$("#exe_express_preview").val("");
					
					for(var i=0; i<hidden_arr.length; i++){
						per = hidden_arr[i];
						cur_line = $(".express-set-line", express_set).eq(i);
						$("select[name='express-name']", cur_line).val(per[0]).change();
						if($("select[name='express-operate']", cur_line).length > 0){
							$("select[name='express-operate']", cur_line).val(per[1]).change();
							$("select[name='express-value']", cur_line).val(per[2]);
							if($("select[name='express-value']", cur_line).val() === null){
								$("select[name='express-value']", cur_line).val("")
								$("input[name='express-value']", cur_line).val(per[2]);
							}
							$("select[name='express-conect']", cur_line).val(per[3] || "").change();
						}else if($("select[name='express-value']", cur_line).length > 0){
							$("select[name='express-value']", cur_line).val(per[1]);
							if($("select[name='express-value']", cur_line).val() === null){
								$("select[name='express-value']", cur_line).val("")
								$("input[name='express-value']", cur_line).val(per[1]);
							}
							$("select[name='express-conect']", cur_line).val(per[2] || "").change();
						}else{
							$("select[name='express-conect']", cur_line).val(per[1] || "").change();
						}
					}
				});
			});*/
			this.common_init_select_change("pattern");
			this.common_init_input_keyup("sign");

			this.common_init_checkbox_click("mode1");
			this.common_init_checkbox_click("mode2");
			this.common_init_checkbox_click("mode3");
			this.common_init_checkbox_click("mode4");

			this.common_init_slidebar("form_form_visible");
			this.common_init_slidebar("form_form_edit");
			this.common_init_slidebar("form_pay_visible");
			this.common_init_slidebar("form_pay_edit");
			this.common_init_slidebar("form_charge_visible");
			this.common_init_slidebar("form_charge_edit");
			this.common_init_slidebar("form_share_visible");
			this.common_init_slidebar("form_share_edit");
			this.common_init_slidebar("form_repay_visible");
			this.common_init_slidebar("form_repay_edit");

			/*this.common_init_slidebar("form_charge_visible");
			this.common_init_slidebar("form_charge_edit");

			this.common_init_slidebar("field_form_visible");
			this.common_init_slidebar("field_form_edit");
			this.common_init_slidebar("field_form_back");
			this.common_init_slidebar("field_form_required");
			this.common_init_slidebar("field_pay_visible");
			this.common_init_slidebar("field_pay_edit");
			this.common_init_slidebar("field_pay_back");
			this.common_init_slidebar("field_pay_required");
			this.common_init_slidebar("field_approve_visible");
			this.common_init_slidebar("field_approve_edit");
			this.common_init_slidebar("field_approve_back");
			this.common_init_slidebar("field_approve_required");
			this.common_init_slidebar("field_charge_visible");
			this.common_init_slidebar("field_charge_edit");
			this.common_init_slidebar("field_charge_back");
			this.common_init_slidebar("field_charge_required");*/

			for(var i=0; i<this.name_arr.length; i++){
				for(var j=0; j<this.name_arr[i].length; j++){
					this.common_init_slidebar(this.name_arr[i][j]);
				}
			}
		},

		init_values: function(){
			this.common_set_form_value("name");
			this.common_set_form_value("executor");
			this.common_set_form_value("express");
			this.common_set_form_value("pattern");
			this.common_set_form_value("sign");

			this.common_set_checkbox_value("mode1");
			this.common_set_checkbox_value("mode2");
			this.common_set_checkbox_value("mode3");
			this.common_set_checkbox_value("mode4");

			this.common_set_slidebar_value("form_form_visible");
			this.common_set_slidebar_value("form_form_edit");
			this.common_set_slidebar_value("form_pay_visible");
			this.common_set_slidebar_value("form_pay_edit");
			/*this.common_set_slidebar_value("form_approve_visible");
			this.common_set_slidebar_value("form_approve_edit");*/
			this.common_set_slidebar_value("form_charge_visible");
			this.common_set_slidebar_value("form_charge_edit");
			this.common_set_slidebar_value("form_share_visible");
			this.common_set_slidebar_value("form_share_edit");
			this.common_set_slidebar_value("form_repay_visible");
			this.common_set_slidebar_value("form_repay_edit");

			/*this.common_set_slidebar_value("field_form_visible");
			this.common_set_slidebar_value("field_form_edit");
			this.common_set_slidebar_value("field_form_back");
			this.common_set_slidebar_value("field_form_required");
			this.common_set_slidebar_value("field_pay_visible");
			this.common_set_slidebar_value("field_pay_edit");
			this.common_set_slidebar_value("field_pay_back");
			this.common_set_slidebar_value("field_pay_required");
			this.common_set_slidebar_value("field_approve_visible");
			this.common_set_slidebar_value("field_approve_edit");
			this.common_set_slidebar_value("field_approve_back");
			this.common_set_slidebar_value("field_approve_required");
			this.common_set_slidebar_value("field_charge_visible");
			this.common_set_slidebar_value("field_charge_edit");
			this.common_set_slidebar_value("field_charge_back");
			this.common_set_slidebar_value("field_charge_required");*/
		
			for(var i=0; i<this.name_arr.length; i++){
				for(var j=0; j<this.name_arr[i].length; j++){
					this.common_set_slidebar_value(this.name_arr[i][j]);
				}
			}
		},

		_init_dialog: function(context, data){
			var _this = this;
			var express_set = $(".express-set", context);
			var express_preview = $("#express_preview");
			
			$(context).on("change", "select[name='express-name']", function(){
				var value = this.value;
				var index = this.selectedIndex;
				
				var str = '';

				switch(index){
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						str += '<select class="form-common" name="express-value" style="margin-right:0;"><option value="" selected="selected">请选择</option>';
						for(var i=0; i<data[value].length; i++){
							if(index === 1){
								str += '<option value="'+data[value][i].value+'">'+data[value][i].key+'('+data[value][i].value+')</option>';
							}else{
								str += '<option value="'+data[value][i]+'">'+data[value][i]+'</option>';
							}
						}
						str += '</select>';
						str += '<input type="text" class="form-common" name="express-value">';
						break;
					case 0:
					case 6:
					case 9:
					case 12:
					case 13:
						break;
					case 7:
					case 8:
					case 10:
					case 11:
					case 14:
					case 15:
						str += '<select class="form-common" name="express-operate"><option value="" selected="selected">请选择</option>';
						str += '<option value="post">岗位</option>';
						str += '<option value="job">职务</option>';
						str += '<option value="role">流程角色</option>';
						str += '</select>';
						break;
				}

				$("select[name='express-operate'], select[name='express-value'], input[name='express-value']", $(this).parent()).remove();
				if(str) $(str).insertAfter($(this));

				_this._update_express();
			});

			$(context).on("change", "select[name='express-operate']", function(){
				var value = this.value;
				var str = '';
				if(value){
					str += '<select class="form-common" name="express-value"><option value="" selected="selected">请选择</option>';
					for(var i=0; i<data[value].length; i++){
						str += '<option value="'+data[value][i]+'">'+data[value][i]+'</option>';
					}
					str += '</select>';
					str += '<input type="text" class="form-common" name="express-value">';
				}
				$("select[name='express-value'], input[name='express-value']", $(this).parent()).remove();
				if(str) $(str).insertAfter($(this));
				_this._update_express();
			});

			$(context).on("keyup", "input[name='express-value']", function(e){
				_this._update_express();
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
					$("#start_express_model > div").clone().insertAfter(parent);
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

			$("#dialog_start, #dialog_start .icon-cross").click(function(){
				$(".alert", context).removeClass("status");
				context.fadeOut(200);
			});
			$(context).on("click", ".alert", function(){
				return false;
			});

			$("button", context).click(function(){
				// 验证表达式， 错误则给出提示，正确则填充
				var target = _this.target;
				var datas = $("#exe_express_preview").data();
				target.properties.node_attributes.executor = datas.show_value;
				target.properties.node_attributes.executor_arr = JSON.stringify(datas.hidden_arr);

				$(_this.prefix + "express").val(datas.show_value);

				$(".alert", context).removeClass("status");
				context.fadeOut(200);
			});
		},

		_update_express: function(){
			var context = $("#dialog_start");
			var line = $(".express-set-line", context);
			var show_value = "";
			var hidden_arr = [];

			line.each(function(index){
				var control = $("select[name='express-name']", this);
				var control_index = control[0].selectedIndex;
				var control_value = control[0].selectedOptions[0].innerHTML;
				var operate = $("select[name='express-operate']", this);
				var value_select = $("select[name='express-value']", this);
				var value_input = $.trim($("input[name='express-value']", this).val());
				var conect = $("select[name='express-conect']", this).val();
				var arr = [];

				switch(control_index){
					case 1:
					case 2:
					case 3:
					case 4:
					case 5:
						show_value += control_value;
						arr.push(control.val());
						if(value_select.val()){
							show_value += '['+value_select.val()+']';
							arr.push(value_select.val());
						}else{
							show_value += '['+value_input+']';
							arr.push(value_input);
						}
						break;
					case 0:
						break;
					case 6:
					case 9:
					case 12:
					case 13:
						show_value += control_value;
						arr.push(control.val());
						break;
					case 7:
					case 8:
					case 10:
					case 11:
					case 14:
					case 15:
						show_value += control_value;
						arr.push(control.val());
						if(operate.val()){
							show_value += ',' + operate[0].selectedOptions[0].innerHTML;
						}
						arr.push(operate.val());
						if(value_select.val()){
							show_value += '['+value_select.val()+']';
							arr.push(value_select.val());
						}else{
							show_value += '['+value_input+']';
							arr.push(value_input);
						}
						break;
				}

				show_value += ";";

				if(conect){
					show_value += conect;
					arr.push(conect);
				}
				hidden_arr.push(arr);
			});

			$("#exe_express_preview").val(show_value).data({
				show_value: show_value,
				hidden_arr: hidden_arr
			});
		},
		
		patch: function(){
			var items = this.target.properties.node_items.items;
			var ptach_area = $("#start_set_patch");
			var str = '';
			var name_arr = [];

			if(items.length <= 0) return;
			
			$(".common-items", ptach_area).remove();
			for(var i=0; i<items.length; i++){
				name_arr.push("field_visible_" + i, "field_edit_" + i, "field_back_" + i, "field_required_" + i);
				str += '<div class="common-items">';
				str += '<div>'+items[i].itemName+'</div>';
				str += '<div><label class="checbox" id="start_set_field_visible_'+i+'" data-key="node_items.items.'+i+'.isShow"><span></span><input type="checkbox"></label></div>';
				str += '<div><label class="checbox" id="start_set_field_edit_'+i+'" data-key="node_items.items.'+i+'.isEdit"><span></span><input type="checkbox"></label></div>';
				str += '<div><label class="checbox" id="start_set_field_back_'+i+'" data-key="node_items.items.'+i+'.isBackEdit"><span></span><input type="checkbox"></label></div>';
				str += '<div><label class="checbox" id="start_set_field_required_'+i+'" data-key="node_items.items.'+i+'.isNotNull"><span></span><input type="checkbox"></label></div>';
				str += '</div>';
			}
			ptach_area.append($(str));

			for(var i=0; i<name_arr.length; i++){
				this.common_init_slidebar(name_arr[i]);
				this.common_set_slidebar_value(name_arr[i]);
			}
		}
	});

	return PDStartGraphSet;
});