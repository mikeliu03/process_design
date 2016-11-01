define(["jquery", "utils", "pd_graph"], function($, utils, PDGraph){
	/**
	 * 页面节点: new editor node
	 */
	function PDStartGraph(opt){
		if(this === window) return;
		this.init(opt);
	}

	PDStartGraph.prototype = utils.inherit(PDGraph.prototype);
	utils.extend(PDStartGraph.prototype, {
		constructor: PDStartGraph,
		
		name: "start",		// 别名

		parent: document.querySelector("#svg_children"),

		size: function(){
			var r = $("circle", this.dom).attr("r");
			return {width: r*2, height: r*2};
		},

		validation: function(){
			var prefix = this.set.prefix;
			var count = 0;

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
			// 只能有一条线连接开始节点
			$("#svg_edge > g").each(function(){
				var source = $(this).data("target").sourceRef;
				if(source){
					var name = $("#" + source).data("target").name;
				}
				if(name === "start") count += 1;
			});
			if(count > 1){
				this.show_error_message("开始节点不能接入多条连接线");
				return false;
			}
			if(count === 0){
				this.show_error_message("开始节点必须必须处于流程中");
				return false;
			}
			// 只能有一个开始节点
			count = 0;
			$("#svg_children > g").each(function(){
				if($(this).data("target").name === "start") count += 1;
			});
			if(count > 1){
				this.show_error_message("只能有一个开始节点");
				return false;
			}
			return true;
		},

		business_data: function(){
			for(var obj in this.properties){
				this.properties[obj].nodeId = this.eventId;
			}
			return {
				flow_node: {
					elem_type: "start",
					x: this.x,
					y: this.y,
					id: this.dom.id,
					eventId: this.eventId,
				},
				properties: this.properties
			};
		},

		activiti_id: function(){
			return this.eventId;
		},

		to_xml: function(){
			var xml='<startEvent id="'+this.eventId+'" name="'+this.name+'"></startEvent>\n';
			return xml;
		},
		
		to_bpm: function(){
			var size = this.size();
			var xml = '<bpmndi:BPMNShape bpmnElement="'+this.eventId+'" id="BPMNShape_'+this.eventId+'">\n';
			xml+='<omgdc:Bounds height="'+size.height+'" width="'+size.width+'" x="'+this.x+'" y="'+this.y+'"/>\n';
			xml=xml+'</bpmndi:BPMNShape>\n';
			return xml;
		}
	});

	return PDStartGraph;
});