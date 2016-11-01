/**
 * SVG流程设计器（SVG process design）
 * 所有类名均以PD作为前缀，如：PDPage、PDNode等
 */


/**
 * 流程设计器页面类
 * @params opt[Object] 参数
 */
function PDPage(opt){}
PDPage.prototype = {
	constructor: PDPage,
	
	/**
	 * 初始化页面
	 */
	init: function(){},

	/**
	 * 初始化图形选择区域事件
	 */
	init_graph_select_area_event: function(){},

	/**
	 * 初始化图形编辑区域事件
	 */
	init_graph_edit_area_event: function(){},
	
	/**
	 * 初始化图形属性设置区域事件
	 */
	init_graph_set_area_event: function(){},

	/**
	 * 初始化页面功能区域事件
	 */
	init_graph_page_func_event: function(){},

	/**
	 * 添加流程
	 */
	add: function(){},
	
	/**
	 * 更新流程
	 */
	update: function(){},
	
	/**
	 * 页面帮助
	 */
	help: function(){},

	/**
	 * 页面保存
	 */
	save: function(){},

	/**
	 * 页面预览
	 */
	unload: function(){}
};

/**
 * 流程设计器图形类
 * 所有图形的父类：包括文档图形类和元素图形类
 * @params opt[Object] 参数
 */
function PDGraph(opt){}
PDGraph.prototype = {
	constructor: PDGraph,

	name: "",

	dom: null,
	
	parent: null,
	
	set: null,
	
	target: null,
	
	_html: "",

	properties: {},
	
	init: function(){},
	
	init_style: function(){},
	
	init_event: function(){},
	
	click: function(){},
	
	contextmenu: function(){},
	
	resize: function(){},
	
	drag: function(){},

	copy: function(){},

	cut: function(){},
	
	paste: function(){},

	del: function(){},

	is_connect: function(){}
	
	to_xml: function(){},

	create_id: function(){},

	valid: function(){},
	
	destroy: function(){}
};

/**
 * 流程设计器SVG图形类
 * 绘图容器
 * @params opt[Object] 参数
 */
function PDSVGGraph(opt){}
PDSVGGraph.prototype = {
	constructor: PDSVGGraph,
	
	name: "svg",

	copy: function(){},

	paste: function(){},

	cut: function(){},

	del: function(){}

	undo: function(){},

	back: function(){},

	zoom: function(){},
	
	narrow: function(){},

	range_select: function(){}
};

/**
 * 流程设计器元素图形类
 * 所有图形的父类
 * @params opt[Object] 参数
 */
function PDElementGraph(opt){}
PDElementGraph.prototype = {
	constructor: PDElementGraph,
	
	name: "element",
	
	
};

/**
 * 流程设计器开始图形类
 * @params opt[Object] 参数
 */
function PDBeginGraph(opt){}

/**
 * 流程设计器结束图形类
 * @params opt[Object] 参数
 */
function PDEndGraph(opt){}

/**
 * 流程设计器用户任务图形类
 * @params opt[Object] 参数
 */
function PDUserTaskGraph(opt){}

/**
 * 流程设计器顺序流程线图形类
 * @params opt[Object] 参数
 */
function PDCableGraph(opt){}

/**
 * 流程设计器顺序流程线图形类
 * @params opt[Object] 参数
 */
function PDCableGraph(opt){}
