define(["jquery", "utils", "pd_graph"], function($, utils, PDGraph){
	/**
	 * 页面节点: new editor node
	 */
	function PDUserTaskGraph(opt){
		if(this === window) return;
		this.init(opt);
	}

	PDUserTaskGraph.prototype = utils.inherit(PDGraph.prototype);
	utils.extend(PDUserTaskGraph.prototype, {
		constructor: PDUserTaskGraph,
		
		name: "task",		// 别名

		parent: document.querySelector("#svg_children"),

		text: function(){
			$("tspan", this.dom).html(this.attr($(this.set.prefix + "name")));
		},

		size: function(){
			var rect = $("rect", this.dom);
			return {width: +rect.attr("width"), height: +rect.attr("height")};
		},

		validation: function(){
			var prefix = this.set.prefix;
			var lines = this.properties.node_attributes.lines;
			var arr_target = [];
			var arr_source = [];
			var per = null;

			// 验证环节名称和执行者表达式
			if(this.attr($(prefix + "name")) === ""){
				this.show_error_message("请输入环节名称");
				$(this.dom).click();
				return false;
			}
			if(this.attr($(prefix + "express")) === ""){
				this.show_error_message("请输入执行者表达式");
				$(this.dom).click();
				return false;
			}
			if(this.attr($(prefix + "pattern")) === "1"){
				if(this.attr($(prefix + "sign")) === ""){
					this.show_error_message("请输入会签人数");
					$(this.dom).click();
					return false;
				}
				if(+this.attr($(prefix + "sign")) <= 0 || !/^\d+$/.test(this.attr($(prefix + "sign")))){
					this.show_error_message("会签人数必须为大于0的整数");
					$(this.dom).click();
					return false;
				}
			}
			// 判断节点是否在流程内（节点必须有线连接）
			if(lines.length <= 0){
				this.show_error_message("节点必须在流程中。");
				$(this.dom).click();
				return false;
			}
			for(var i=0; i<lines.length; i++){
				per = $("#" + lines[i]).data("target");
				arr_target.push(per.targetRef);
				arr_source.push(per.sourceRef);
			}
			if(arr_target.indexOf(this.id) >= 0 && arr_source.indexOf(this.id) >= 0){}else{
				this.show_error_message("节点必须在流程中。");
				$(this.dom).click();
				return false;
			}
			return true;
		},
		
		business_data: function(){
			for(var obj in this.properties){
				this.properties[obj].nodeId = this.taskId;
			}
			
			this.properties.node_attributes.codeType = "usertask";

			return {
				flow_node: {
					elem_type: "usertask",
					x: this.x,
					y: this.y,
					id: this.dom.id,
					taskId: this.taskId,
				},
				properties: this.properties
			};
		},

		activiti_id: function(){
			return this.taskId;
		},

		to_xml: function(){
			var xml='<userTask id="'+this.taskId+'" name="'+this.properties.node_attributes.showType+'">';
			if(this.properties.node_attributes.pattern === "1"){
				xml += '<multiInstanceLoopCharacteristics isSequential="false" activiti:collection="${countersignUsers}" activiti:elementVariable="countersignUser">'+
					  '<completionCondition>'+
						'${counterSignService.canComplete('+
							'execution,'+
							'nrOfInstances,'+
							'nrOfActiveInstances,'+
							'nrOfCompletedInstances,'+
							'loopCounter)}'+
					  '</completionCondition>'+
					'</multiInstanceLoopCharacteristics>';
			}
			xml += '</userTask>\n';
			return xml;
		},
		
		to_bpm: function(){
			var size = this.size();
			var xml = '<bpmndi:BPMNShape bpmnElement="'+this.taskId+'" id="BPMNShape_'+this.taskId+'">\n';
			xml+='<omgdc:Bounds height="'+size.height+'" width="'+size.width+'" x="'+this.x+'" y="'+this.y+'"/>\n';
			xml=xml+'</bpmndi:BPMNShape>\n';
			return xml;
		}
	});

	return PDUserTaskGraph;
});