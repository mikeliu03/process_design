define(function(require){
	var $ = require("jquery");		// 引入jquery
	var utils = require("utils");
	var config = require("config");

	/************************ 模块和模块定义类引入 ***********************************/
	var PDStartGraph = require("pd_start_graph");
	var PDStartGraphSet = require("pd_start_graph_set");
	var PDEndGraph = require("pd_end_graph");
	var PDEndGraphSet = require("pd_end_graph_set");
	var PDUserTaskGraph = require("pd_usertask_graph");
	var PDUserTaskGraphSet = require("pd_usertask_graph_set");
	var PDCableGraph = require("pd_cable_graph");
	var PDCableGraphSet = require("pd_cable_graph_set");
	/************************ 模块和模块定义类引入 end ***********************************/

	var start_set = end_set = task_set = line_set = null;

	/**
	 * 页面: new editor page
	 */
	function PDPage(opt){
		if(this === window) return;

		this.init(opt);
	}
	
	PDPage.prototype =  {
		constructor: PDPage,
		
		init: function(opt){
			this.init_graph_set();
			this.init_header_events();
			this.init_graph_check();
			this.init_main_events();
			// 判断是添加还是更新流程
			var type = $("#option").val();
			if(type === "add"){		// 添加流程
				new PDStartGraph({set: start_set,flow_node: {x: 100,y: 100}});
				new PDEndGraph({set: end_set,flow_node: {x: 600,y: 100}});
			}else{
				$.ajax({
					url: "flow.json",
					type: "get",
					data: {modelId: $("#modelId").val()},
					dataType: "json",
					success: function(data){
						var per = null;
						data = data.nodes;
						if(!data){
							new PDStartGraph({set: start_set,flow_node: {x: 100,y: 100}});
							new PDEndGraph({set: end_set,flow_node: {x: 600,y: 100}});
							return;
						}
						for(var i=0; i<data.length; i++){
							var per = data[i];
							switch(per.flow_node.elem_type){
								case "start":
									new PDStartGraph($.extend(per, {set: start_set}));
									break;
								case "usertask":
									new PDUserTaskGraph($.extend(per, {set: task_set}));
									break;
								case "line":
									new PDCableGraph($.extend(per, {set: line_set}));
									break;
								case "end":
									new PDEndGraph($.extend(per, {set: end_set}));
									break;
							}
						}
					}
				});
			}
		},

		init_header_events: function(){
			var _this = this;
			$("#menu").click(function(){
				$(this).parent().toggleClass("status");
				$(".menus,.container").toggleClass("status");
				if($(".container").hasClass("status")){
					$(this).addClass("icon-maximize").removeClass("icon-minimize");
				}else{
					$(this).removeClass("icon-maximize").addClass("icon-minimize");
				}
			});
			
			var is_save = false;
			$("#save").click(function(){
				var elements = $("#svg_children > g, #svg_edge > g");
				var valid = false;
				var url = "";
				var type = $("#option").val();
				var obj = {
					corpId: $("#corpId").val(),
					modelId: $("#modelId").val()
				};
				
				if(is_save) return;
				
				obj.json_xml = "";
				obj.json_custom = {};
				obj.json_custom.nodes = [];

				for(var i=0; i<elements.length; i++){
					valid = $(elements[i]).data("target").validation();
					if(!valid){
						is_save = false;
						return;
					}
				}

				$("#svg_children > g, #svg_edge > g").each(function(){
					obj.json_custom.nodes.push($(this).data("target").business_data());
				});

				obj.json_custom = JSON.stringify(obj.json_custom, null, 2);
				obj.json_xml = _this.to_xml(elements);

				console.log(obj.json_custom);
				console.log(obj.json_xml);

				if (type == "add") {
					url = "saveWorkflowDesignMain.ajax";
				} else {
					url = "editWorkflowDesignMain.ajax";
				}
				is_save = true;
				$.ajax({
					url: "flow.json",
					type: "post",
					data: obj,
					dataType: "json",
					success: function(data){
						is_save = false;
						if(data.msgType=="N"){
							utils.show_error_message("保存成功");
						}else{
							utils.show_error_message(data.rspMsg);
						}
					}
				});
			});
			
			//发布
			$("#deploy").click(function(){
				var modelId = jQuery("#modelId").val();
				var wfBaseId = jQuery("#wfBaseId").val();
				var data = "modelId=" + modelId + "&wfBaseId=" + wfBaseId;
				jQuery.ajax({
					url: "deployWorkflowProcess.ajax",
					type: "get",
					data: data,
					dataType: "json",
					success: function(data){
						if (data.msgType == 'N') {
							alert("部署流程成功!");
							$("#deploy").attr('disabled',"true");
						} else {
							alert("部署流程失败!");
						}
					}
				});
			});

			$("#alert, #alert button, #alert .icon-cross").click(function(){
				$("#alert .alert").removeClass("status");
				$("#alert").fadeOut(200);
				$(document.body).removeClass("modal-open");
			});
			$("#alert .alert").click(function(){
				return false;
			});
		},

		init_graph_check: function(){
			var doc = $(document.body);
			var move_x = move_y = 0;
			var is_move = false;
			var inner_html = "";
			var drag = $("#drag");
			var svg = $("svg");
			
			var type = "";
			$(".menus li").mousedown(function(e){
				init_x = e.pageX;
				init_y = e.pageY;
				type = $(this).data("type");
				inner_html = this.innerHTML;
				
				doc.on("mousemove", move).on("mouseup", up);
			});

			function move(e){
				is_move = true;
				move_x = e.pageX;
				move_y = e.pageY;
				drag.html(inner_html).removeClass("hide").css({
					top: move_y,
					left: move_x
				});

				e.preventDefault();
			}

			function up(e){
				var svg_offset = svg.offset();
				var x = y = 0;
				if(is_move && move_x > svg_offset.left && move_x < svg_offset.left + svg.width() && move_y > svg_offset.top && move_y < svg_offset.top + svg.height()){
					x = move_x - svg_offset.left;
					y = move_y - svg_offset.top;
					switch(type){
						case "start":
							new PDStartGraph({set: start_set,flow_node: {x: x,y: y}});
							break;
						case "task":
							new PDUserTaskGraph({set: task_set,flow_node: {x: x,y: y}});
							break;
						case "line":
							new PDCableGraph({set: line_set,flow_node: {startX: x,startY: y, endX: x + 100, endY: y}});
							break;
						case "end":
							new PDEndGraph({set: end_set,flow_node: {x: x,y: y}});
							break;
					}
					is_move = false;
				}
				drag.addClass("hide");
				doc.off("mousemove", move).off("mouseup", up);
			}
		},

		init_graph_set: function(){
			$.ajax({
				url: "flow.json",
				type: "get",
				async: false,
				data: {},
				dataType: "json", 
				success: function(data){
					data = [
						[
							{title: "aaaaaaaa"},
							{
								itemName: "字段1",
								itemId: "001",
								isEdit: "000",
								isShow: "000",
								isNotNull: "000",
								wfBaseId:$("#wfBaseId").val(),
								isBackEdit: "000"
							},
							{
								itemName: "字段2",
								itemId: "001",
								isEdit: "000",
								isShow: "000",
								isNotNull: "000",
								wfBaseId:$("#wfBaseId").val(),
								isBackEdit: "000"
							},
							{
								itemName: "字段3",
								itemId: "001",
								isEdit: "000",
								isShow: "000",
								isNotNull: "000",
								wfBaseId:$("#wfBaseId").val(),
								isBackEdit: "000"
							}
						],
						[
							{title: "bbbbbbbb"},
							{
								itemName: "字段1",
								itemId: "001",
								isEdit: "000",
								isShow: "000",
								isNotNull: "000",
								wfBaseId:$("#wfBaseId").val(),
								isBackEdit: "000"
							},
							{
								itemName: "字段2",
								itemId: "001",
								isEdit: "000",
								isShow: "000",
								isNotNull: "000",
								wfBaseId:$("#wfBaseId").val(),
								isBackEdit: "000"
							},
							{
								itemName: "字段3",
								itemId: "001",
								isEdit: "000",
								isShow: "000",
								isNotNull: "000",
								wfBaseId:$("#wfBaseId").val(),
								isBackEdit: "000"
							}
						]
					];
					var ptach_area = $("#start_set, #task_set");
					var ptach_area_task = $("#task_set");
					var ptach_area_start = $("#start_set");
					var str = '';
					var str_task = str_start = '';
					var name_arr_task = [];
					var name_arr_start = [];
					var task_data = [];
					var start_data = [];

					for(var x=0; x<data.length; x++){
						task_data[x] = [];
						start_data[x] = []
						task_data[x][0] = start_data[x][0] = data[x][0];
						for(var y=1; y<data[x].length; y++){
							start_data[x][y] = {
								area: data[x][y]["area"],
								areaName: data[x][y]["areaName"],
								itemName: data[x][y]["itemName"],
								itemId: "001",
								isEdit: "000",
								isShow: "000",
								isNotNull: "000",
								wfBaseId:$("#wfBaseId").val(),
								isBackEdit: "001"
							};
							task_data[x][y] = {
								area: data[x][y]["area"],
								areaName: data[x][y]["areaName"],
								itemName: data[x][y]["itemName"],
								itemId: "001",
								isEdit: "001",
								isShow: "000",
								isNotNull: "001",
								wfBaseId:$("#wfBaseId").val(),
								isBackEdit: "001"
							};
						}
					}

					config.task_business.properties.node_items.items = task_data;
					config.start_business.properties.node_items.items = start_data;
					var items = data;

					for(var i=0; i<items.length; i++){
						str_task += '<div class="common-shadow"><div class="common-table-title">'+items[i][0].title+'<span class="icon-maximize"></span></div><div class="common-table table-bg hide">';
						str_task += '<div class="common-header"><div>区域名称</div><div>可见</div><div>可编辑</div><div>退回</div><div>必填</div></div>';
						
						for(var j=1; j<items[i].length; j++){
							name_arr_task.push(["field_visible_" + i + j, "field_edit_" + i + j, "field_back_" + i + j, "field_required_" + i + j]);
							str_task += '<div class="common-items">';
							str_task += '<div>'+items[i][j].itemName+'</div>';
							str_task += '<div><label class="checbox" id="task_set_field_visible_'+i+j+'" data-key="node_items.items.'+i+'.'+j+'.isShow"><span></span><input type="checkbox"></label></div>';
							str_task += '<div><label class="checbox" id="task_set_field_edit_'+i+j+'" data-key="node_items.items.'+i+'.'+j+'.isEdit"><span></span><input type="checkbox"></label></div>';
							str_task += '<div><label class="checbox" id="task_set_field_back_'+i+j+'" data-key="node_items.items.'+i+'.'+j+'.isBackEdit"><span></span><input type="checkbox"></label></div>';
							str_task += '<div><label class="checbox" id="task_set_field_required_'+i+j+'" data-key="node_items.items.'+i+'.'+j+'.isNotNull"><span></span><input type="checkbox"></label></div>';
							str_task += '</div>';
						}

						str_task += '</div></div>';
					}
					for(var i=0; i<items.length; i++){
						str_start += '<div class="common-shadow"><div class="common-table-title">'+items[i][0].title+'<span class="icon-maximize"></span></div><div class="common-table table-bg hide">';
						str_start += '<div class="common-header"><div>区域名称</div><div>可见</div><div>可编辑</div><div>退回</div><div>必填</div></div>';
						
						for(var j=1; j<items[i].length; j++){
							name_arr_start.push(["field_visible_" + i + j, "field_edit_" + i + j, "field_back_" + i + j, "field_required_" + i + j]);
							str_start += '<div class="common-items">';
							str_start += '<div>'+items[i][j].itemName+'</div>';
							str_start += '<div><label class="checbox" id="start_set_field_visible_'+i+j+'" data-key="node_items.items.'+i+'.'+j+'.isShow"><span></span><input type="checkbox"></label></div>';
							str_start += '<div><label class="checbox" id="start_set_field_edit_'+i+j+'" data-key="node_items.items.'+i+'.'+j+'.isEdit"><span></span><input type="checkbox"></label></div>';
							str_start += '<div><label class="checbox" id="start_set_field_back_'+i+j+'" data-key="node_items.items.'+i+'.'+j+'.isBackEdit"><span></span><input type="checkbox"></label></div>';
							str_start += '<div><label class="checbox" id="start_set_field_required_'+i+j+'" data-key="node_items.items.'+i+'.'+j+'.isNotNull"><span></span><input type="checkbox"></label></div>';
							str_start += '</div>';
						}

						str_start += '</div></div>';
					}
					ptach_area_task.append($(str_task));
					ptach_area_start.append($(str_start));
					start_set = new PDStartGraphSet({name_arr: name_arr_start});
					task_set = new PDUserTaskGraphSet({name_arr: name_arr_task});
				}
			});
			
			end_set = new PDEndGraphSet();
			line_set = new PDCableGraphSet();
		},
		
		init_main_events: function(){
			$("svg").click(function(){
				$("#gid_selected").attr("display", "none");
				$("#settings, .editor").removeClass("status");
				$("#settings > div").attr("style", "");
			});

			$(document).keyup(function(e){
				if(+e.keyCode === 46){
					$("#svg .mark").data("target").destroy();
					$("#gid_selected").attr("display", "none");
					$("#settings > div").attr("style", "");
					$("#settings, .editor").removeClass("status");
				}
			});
		},
		
		to_xml: function(elements){
			var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
			xml += '<definitions  xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="demo_wf_process_def">\n';

			var process_time = new Date().getTime();
			xml += '<process  id="process'+process_time+'" name="process'+process_time+'">\n';
			elements.each(function(){
				xml += $(this).data("target").to_xml();
			});
			xml += '</process>\n';
			xml += '<bpmndi:BPMNDiagram id="BPMNDiagram_process'+process_time+'">\n';
			xml += '<bpmndi:BPMNPlane bpmnElement="process'+process_time+'" id="BPMNPlane_process'+process_time+'">\n';
			elements.each(function(){
				xml += $(this).data("target").to_bpm();
			});
			xml += '</bpmndi:BPMNPlane>\n';
			xml += '</bpmndi:BPMNDiagram>\n';
			xml += '</definitions>\n';

			return xml;
		}
	};

	return PDPage;
});