define(["jquery", "utils", "pd_graph"], function($, utils, PDGraph){
	/**
	 * 页面节点: new editor node
	 */
	function PDElementGraph(){}

	PDElementGraph.prototype = utils.inherit(PDGraph.prototype);
	$.extend(PDElementGraph.prototype, {
		constructor: PDElementGraph,
		
		name: "element graph",		// 别名

		/**
		 * 验证当前对象的值
		 */
		validation: function(){},

		/**
		 * 选取操作
		 */
		select: function(){},

		/**
		 * 对象click事件
		 */
		click: function(){},

		/**
		 * 对象contextmenu事件
		 */
		contextmenu: function(){},

		/**
		 * 对象drag和resize事件
		 */
		drag: function(){}
	});

	return PDElementGraph;
});