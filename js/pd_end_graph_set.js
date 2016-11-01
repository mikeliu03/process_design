define(["jquery", "utils", "pd_graph_set"], function($, utils, PDGraphSet){
	/**
	 * 页面节点: new editor node
	 */
	function PDEndGraphSet(opt){
		if(this === window) return;
		this.init(opt);
	}

	PDEndGraphSet.prototype = utils.inherit(PDGraphSet.prototype);
	utils.extend(PDEndGraphSet.prototype, {
		constructor: PDEndGraphSet,
		
		name: "end_set",		// 别名

		init_event: function(){},

		init_values: function(){}
	});

	return PDEndGraphSet;
});