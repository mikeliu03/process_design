define(["jquery", "utils", "pd_graph"], function($, utils, PDGraph){
	/**
	 * 页面节点: new editor node
	 */
	function PDEndGraph(opt){
		if(this === window) return;
		this.init(opt);
	}

	PDEndGraph.prototype = utils.inherit(PDGraph.prototype);
	utils.extend(PDEndGraph.prototype, {
		constructor: PDEndGraph,
		
		name: "end",		// 别名

		parent: document.querySelector("#svg_children"),

		size: function(){
			var r = $("circle", this.dom).attr("r");
			return {width: r*2, height: r*2};
		},

		business_data: function(){
			return {
				flow_node: {
					elem_type: "end",
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

		validation: function(){
			// 只能有一个开始节点
			count = 0;
			$("#svg_children > g").each(function(){
				if($(this).data("target").name === "end") count += 1;
			});
			if(count > 1){
				this.show_error_message("只能有一个结束节点");
				return false;
			}
			count = 0;
			// 只能有一条线连接开始节点
			$("#svg_edge > g").each(function(){
				var source = $(this).data("target").targetRef;
				if(source){
					var name = $("#" + source).data("target").name;
				}
				if(name === "end") count += 1;
			});
			if(count === 0){
				this.show_error_message("结束节点必须处于流程中");
				return false;
			}
			return true;
		},

		to_xml: function(){
			var xml='<endEvent id="'+this.eventId+'" name="'+this.name+'"></endEvent>\n';
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

	return PDEndGraph;
});