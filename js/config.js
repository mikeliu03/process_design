define(["jquery", "utils"], function($, utils){
	var business_properties_start = {
		node_attributes: {
			lines: [],
			corpId: $("#corpId").val(),
			nodeId: 0,
			showType: "环节名称",		// 环节名称
			codeType: "start",			
			codeRuleId: $("#codeRuleId").val(),	//*****************************update:先写死,后面改***************************/	,		
			wfBaseId: $("#wfBaseId").val(),//*****************************update:先写死,后面改***************************/	,		
			//executorType:0,	// 执行者（角色/人员）： 0/1  //*****************************update:先写死,后面改***************************/	,		
			linkType: 0,			// 环节类型（审批必经/环节必经）
			executor: "常用变量[创建人];",			// 执行者表达式   //*****************************update:先写死,后面改***************************/	,		
			executor_arr: '[["creator"]]',
			executorIds: [],		// 执行者表达式要保存的ID
			pattern: 0,				// 执行模式（抢占模式/会签模式/共享模式）：0/1/2
			minSign: "99"
		},
		node_area: {
			corpId: $("#corpId").val(),
			nodeId: 0,
			items: [
				{
					areaName: "明细区",
					areaCode: "detail",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "000"
				},
				{
					areaName: "付款区",
					areaCode: "payment",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "000"
				},
				{
					areaName: "冲销区",
					areaCode: "rever",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "000"
				},
				{
					areaName: "分摊区",
					areaCode: "share",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "000"
				},
				{
					areaName: "还款区",
					areaCode: "repay",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "000"
				}				
			]
		},
		node_items: {
			corpId: $("#corpId").val(),
			nodeId: 0,
			items: [
				
			]
		},
		node_options: {
			corpId: $("#corpId").val(),
			nodeId: 0,
			items: [
				{
					accessCode: "operateAttachment",
					accessName: "允许操作附件",
					wfBaseId:$("#wfBaseId").val(),
					enable: "001"
				},
				{
					accessCode: "viewAttachment",
					accessName: "允许查看附件",
					wfBaseId:$("#wfBaseId").val(),
					enable: "000"
				},
				{
					accessCode: "viewBudget",
					accessName: "允许查看预算",
					wfBaseId:$("#wfBaseId").val(),
					enable: "000"
				},
				{
					accessCode: "changeApprover",
					accessName: "提交时，允许变更审批人（不固定）",
					wfBaseId:$("#wfBaseId").val(),
					enable: "001"
				},
				{
					accessCode: "dontAllowSkip",
					accessName: "如果审批人员为空，不允许跳过",
					wfBaseId:$("#wfBaseId").val(),
					enable: "001"
				}
			]
		}
	};

	var business_properties_usertask = {
		node_attributes: {
			lines: [],
			corpId: $("#corpId").val(),
			nodeId: 0,
			showType: "",		// 环节名称
			codeType: "start",			
			codeRuleId: $("#codeRuleId").val(),	//*****************************update:先写死,后面改***************************/	,		
			wfBaseId: $("#wfBaseId").val(),//*****************************update:先写死,后面改***************************/	,		
			//executorType:0,	// 执行者（角色/人员）： 0/1  //*****************************update:先写死,后面改***************************/	,		
			linkType: 0,			// 环节类型（审批必经/环节必经）
			executor: "",			// 执行者表达式   //*****************************update:先写死,后面改***************************/	,		
			executor_arr: "",
			executor_hidden: "",
			executorIds: [],		// 执行者表达式要保存的ID
			pattern: 0,				// 执行模式（抢占模式/会签模式/共享模式）：0/1/2
			minSign: "99"
		},
		node_area: {
			corpId: $("#corpId").val(),
			nodeId: 0,
			items: [
				{
					areaName: "明细区",
					areaCode: "detail",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "001"
				},
				{
					areaName: "付款区",
					areaCode: "payment",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "001"
				},
				{
					areaName: "冲销区",
					areaCode: "rever",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "001"
				},
				{
					areaName: "分摊区",
					areaCode: "share",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "001"
				},
				{
					areaName: "还款区",
					areaCode: "repay",
					isShow: "000",
					wfBaseId:$("#wfBaseId").val(),
					isEdit: "001"
				}				
			]
		},
		node_items: {
			corpId: $("#corpId").val(),
			nodeId: 0,
			items: [
				
			]
		},
		node_options: {
			corpId: $("#corpId").val(),
			nodeId: 0,
			items: [
				{
					accessCode: "operateAttachment",
					accessName: "允许操作附件",
					wfBaseId:$("#wfBaseId").val(),
					enable: "001"
				},
				{
					accessCode: "viewAttachment",
					accessName: "允许查看附件",
					wfBaseId:$("#wfBaseId").val(),
					enable: "000"
				},
				{
					accessCode: "viewBudget",
					accessName: "允许查看预算",
					wfBaseId:$("#wfBaseId").val(),
					enable: "000"
				},
				{
					accessCode: "changeApprover",
					accessName: "提交时，允许变更审批人（不固定）",
					wfBaseId:$("#wfBaseId").val(),
					enable: "001"
				},
				{
					accessCode: "dontAllowSkip",
					accessName: "如果审批人员为空，不允许跳过",
					wfBaseId:$("#wfBaseId").val(),
					enable: "001"
				}
			]
		}
	};

	var start_me = [
		{
			name: "g",
			attr: {"pointer-events": "fill", title: "开始事件"},
			nodes: [
				{name: "circle", attr: {cx: 15, cy: 15, r: 15, stroke: "black", fill: "white", "stroke-width": 1}, nodes: []}
			]
		}
	];
	var start_stencils = {
		name: "g",
		attr: {"class": "stencils", "transform": ""},
		nodes: [
			{name: "g", attr: {"class": "me"}, nodes: start_me},
			{name: "g", attr: {"class": "children"}, nodes: []},
			{name: "g", attr: {"class": "edge"}, nodes: []}
		]
	};
	var start_magnets = [
		{
			name: "g",
			attr: {"pointer-events": "all", "display": "none", "transform": "translate(7, 7)"}, 
			nodes: [
				{name: "circle", attr: {cx: 8, cy: 8, r: 4, stroke: "none", fill: "red", "fill-opacity": 0.3}, nodes: []}
			]
		}
	];
	var start_controls = {
		name: "g",
		attr: {"class": "controls"},
		nodes: [
			{name: "g", attr: {"class": "magnets", "transform": ""}, nodes: start_magnets}
		]
	};
	var start_structure = {
		name: "g",
		attr: {id: ""},
		nodes: [start_stencils, start_controls]
	};
	var start_business = {
		flow_node: {
			elem_type: "start",
			x: 0,
			y: 0,
			id: "",
			eventId: "",
		},
		properties: $.extend(true, {}, business_properties_start)
	};

	var end_me = [
		{
			name: "g",
			attr: {"pointer-events": "fill", title: "结束事件"},
			nodes: [
				{name: "circle", attr: {cx: 15, cy: 15, r: 15, stroke: "black", fill: "white", "stroke-width": 3}, nodes: []}
			]
		}
	];
	var end_stencils = {
		name: "g",
		attr: {"class": "stencils", "transform": ""},
		nodes: [
			{name: "g", attr: {"class": "me"}, nodes: end_me},
			{name: "g", attr: {"class": "children"}, nodes: []},
			{name: "g", attr: {"class": "edge"}, nodes: []}
		]
	};
	var end_magnets = [
		{
			name: "g",
			attr: {"pointer-events": "all", "display": "none", "transform": "translate(7, 7)"}, 
			nodes: [
				{name: "circle", attr: {cx: 8, cy: 8, r: 4, stroke: "none", fill: "red", "fill-opacity": 0.3}, nodes: []}
			]
		}
	];
	var end_controls = {
		name: "g",
		attr: {"class": "controls"},
		nodes: [
			{name: "g", attr: {"class": "magnets", "transform": ""}, nodes: end_magnets}
		]
	};
	var end_structure = {
		name: "g",
		attr: {id: ""},
		nodes: [end_stencils, end_controls]
	};
	var end_business = {
		flow_node: {
			elem_type: "end",
			x: 0,
			y: 0,
			id: "",
			eventId: "",
		},
		properties: {}
	};

	var task_me = [
		{
			name: "g",
			attr: {"pointer-events": "fill", title: "用户任务"},
			nodes: [
				{name: "rect", attr: {x: 0, y: 0, width: 100, height: 80, rx: 10, ry: 10, stroke: "black", fill: "#ffc", "stroke-width": 1}, nodes: []},
				{name: "text", attr: {x: 50, y: 40, stroke: "black", "letter-spacing": "-0.01px", "stroke-width": "0pt", "text-anchor": "middle"}, nodes: [
					{name: "tspan", attr: {x: 50, y: 40, dy: 5}, nodes: []}
				]}
			]
		}
	];
	var task_stencils = {
		name: "g",
		attr: {"class": "stencils", "transform": ""},
		nodes: [
			{name: "g", attr: {"class": "me"}, nodes: task_me},
			{name: "g", attr: {"class": "children"}, nodes: []},
			{name: "g", attr: {"class": "edge"}, nodes: []}
		]
	};
	var task_magnets = [
		/*{
			name: "g",
			attr: {"pointer-events": "all", "display": "none", "transform": "translate(-7, 32)"}, 
			nodes: [
				{name: "circle", attr: {cx: 8, cy: 8, r: 4, stroke: "none", fill: "red", "fill-opacity": 0.3}, nodes: []}
			]
		},
		{
			name: "g",
			attr: {"pointer-events": "all", "display": "none", "transform": "translate(42, 71)"}, 
			nodes: [
				{name: "circle", attr: {cx: 8, cy: 8, r: 4, stroke: "none", fill: "red", "fill-opacity": 0.3}, nodes: []}
			]
		},
		{
			name: "g",
			attr: {"pointer-events": "all", "display": "none", "transform": "translate(91, 32)"}, 
			nodes: [
				{name: "circle", attr: {cx: 8, cy: 8, r: 4, stroke: "none", fill: "red", "fill-opacity": 0.3}, nodes: []}
			]
		},
		{
			name: "g",
			attr: {"pointer-events": "all", "display": "none", "transform": "translate(42, -7)"}, 
			nodes: [
				{name: "circle", attr: {cx: 8, cy: 8, r: 4, stroke: "none", fill: "red", "fill-opacity": 0.3}, nodes: []}
			]
		},*/
		{
			name: "g",
			attr: {"pointer-events": "all", "display": "none", "transform": "translate(42, 32)"}, 
			nodes: [
				{name: "circle", attr: {cx: 8, cy: 8, r: 4, stroke: "none", fill: "red", "fill-opacity": 0.3}, nodes: []}
			]
		}
	];
	var task_controls = {
		name: "g",
		attr: {"class": "controls"},
		nodes: [
			{name: "g", attr: {"class": "magnets", "transform": ""}, nodes: task_magnets}
		]
	};
	var task_structure = {
		name: "g",
		attr: {id: ""},
		nodes: [task_stencils, task_controls]
	};
	var task_business = {
		flow_node: {
			elem_type: "usertask",
			x: 0,
			y: 0,
			id: "",
			taskId: "",
		},
		properties: $.extend(true, {}, business_properties_usertask)
	};

	var line_me = [
		{
			name: "g",
			attr: {"pointer-events": "painted"},
			nodes: [
				{name: "path", attr: {d: "M355.109375 119L398.65625 119", stroke: "black", fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round", "marker-start": "url(#flow_start)", "marker-end": "url(#flow_end)", "stroke-width": 2}, nodes: []}
			]
		}
	];
	var line_stencils = {
		name: "g",
		attr: {"class": "stencils"},
		nodes: [
			{name: "g", attr: {"class": "me"}, nodes: line_me},
			{name: "g", attr: {"class": "children"}, nodes: []},
			{name: "g", attr: {"class": "edge"}, nodes: []}
		]
	};
	var line_magnets = [
		{
			name: "g",
			attr: {},
			nodes: [
				{
					name: "g",
					attr: {"pointer-events": "all", "display": "none", "transform": "translate(347.109375, 111)"}, 
					nodes: [
						{name: "circle", attr: {cx: 8, cy: 8, r: 8, stroke: "none", fill: "none"}, nodes: []},
						{name: "circle", attr: {cx: 8, cy: 8, r: 3, stroke: "black", fill: "#0f0", "stroke-width": 2}, nodes: []}
					]
				}/*,
				{
					name: "g",
					attr: {"pointer-events": "none", "display": "none", "transform": "translate(339.5, 119)"}, 
					nodes: [
						{name: "circle", attr: {cx: 0, cy: 0, r: 3, "fill-opacity": 0.4, fill: "red"}, nodes: []}
					]
				}*/
			]
		},
		{
			name: "g",
			attr: {},
			nodes: [
				{
					name: "g",
					attr: {"pointer-events": "all", "display": "none", "transform": "translate(390.65625, 111)"}, 
					nodes: [
						{name: "circle", attr: {cx: 8, cy: 8, r: 8, stroke: "none", fill: "none"}, nodes: []},
						{name: "circle", attr: {cx: 8, cy: 8, r: 3, stroke: "black", fill: "#0f0", "stroke-width": 1}, nodes: []}
					]
				}/*,
				{
					name: "g",
					attr: {"pointer-events": "none", "display": "none", "transform": "translate(449.5, 119)"}, 
					nodes: [
						{name: "circle", attr: {cx: 0, cy: 0, r: 3, "fill-opacity": 0.4, fill: "red"}, nodes: []}
					]
				}*/
			]
		}
	];
	var line_controls = {
		name: "g",
		attr: {"class": "controls"},
		nodes: [
			{name: "g", attr: {"class": "magnets"}, nodes: line_magnets}
		]
	};
	var line_structure = {
		name: "g",
		attr: {id: ""},
		nodes: [line_stencils, line_controls]
	};
	var line_business = {
		flow_node: {
			elem_type: "line",
			startX: 0,
			startY: 0,
			endX: 0,
			endY: 0,
			sourceRef: "",
			targetRef: "",
			id: "",
			lineId: "",
		},
		properties: {
			node_attributes: {
				corpId: $("#corpId").val(),
				nodeId: 0,
				codeType: "line",			
				wfBaseId:$("#wfBaseId").val(),
				showType: "",
				default_path: "001",
				sourceRef: "",
				targetRef: "",
				express: "",
				express_hidden: "",
				express_arr: ""
			}
		}
	};
	
	return {
		//business_properties: business_properties,
		start_business: start_business,
		start_structure: start_structure,
		end_business: end_business,
		end_structure: end_structure,
		task_business: task_business,
		task_structure: task_structure,
		line_business: line_business,
		line_structure: line_structure
	};
});