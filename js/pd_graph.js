define(["jquery", "config"], function($, config){
	/**
	 * 页面节点: new editor node
	 */
	function PDGraph(){}

	PDGraph.prototype = {
		constructor: PDGraph,
		
		name: "",		// 别名

		parent: null,					// 父节点
		
		dom: null,							// 与对象绑定的DOM对象

		set: null,						// 对象对应的设置对象

		target: null,

		properties: {},

		html: "",							// 生成对象的HTML

		/**
		 * 初始化方法
		 */
		init: function(opt){
			var name = this.name;
			var business = config[name + "_business"];
			var structure = config[name + "_structure"];
			$.extend(true, this, business.flow_node, opt && opt.flow_node);
			if(opt && opt.properties){
				this.properties = $.extend(true, {}, opt && opt.properties);
			}else{
				this.properties = $.extend(true, {}, business.properties);
			}

			this.set = opt.set;

			this.id = this.id || name + "-" + this.provide_id();
			if(this.hasOwnProperty("eventId")){
				this.eventId = name;
			}else if(this.hasOwnProperty("taskId")){
				this.taskId = this.taskId || "T" + this.simple_id();
			}else if(this.hasOwnProperty("lineId")){
				this.lineId = this.lineId || "L" + this.simple_id();
			}

			structure.attr.id = this.id;
			structure["nodes"][0]["attr"]["transform"] = structure["nodes"][1]["nodes"][0]["attr"]["transform"] = "translate("+this.x+", "+this.y+")";

			// 初始化样式
			this.init_style(structure, this.parent);

			this.text();

			// 初始化事件
			this.init_event();

			// 绑定对象
			$(this.dom).data("target", this);
		},

		/**
		 * 初始化事件
		 */
		init_event: function(){
			this.click();
			this.drag();
		},

		/**
		 * 初始化样式
		 */
		init_style: function(list, parent){
			var doc = document.querySelector("svg").ownerDocument;
			var xmlns = "http://www.w3.org/2000/svg";

			var elem = doc.createElementNS(xmlns, list.name);
			for(var key in list.attr){
				elem.setAttribute(key, list.attr[key]);
			}
			for(var i=0; i<list.nodes.length; i++){
				this.init_style(list.nodes[i], elem);
			}
			parent.appendChild(elem);

			if(parent === this.parent){
				this.dom = elem;
			}
		},

		text: function(){},

		provide_id: function() {
			var res = [], hex = '0123456789ABCDEF';
		
			for (var i = 0; i < 36; i++) res[i] = Math.floor(Math.random()*0x10);
		
			res[14] = 4;
			res[19] = (res[19] & 0x3) | 0x8;
		
			for (var i = 0; i < 36; i++) res[i] = hex[res[i]];
		
			res[8] = res[13] = res[18] = res[23] = '-';
		
			return "sid-" + res.join('');
		},
		
		simple_id: function() {
			var res = [], hex = '0123456789ABCDEF';
		
			for (var i = 0; i < 21; i++) res[i] = Math.floor(Math.random()*0x10);
		
			res[14] = 4;
			res[19] = (res[19] & 0x3) | 0x8;
		
			for (var i = 0; i < 21; i++) res[i] = hex[res[i]];
		
		
			return res.join('');
		},

		/**
		 * 设置业务属性
		 */
		attr: function(element, value){
			var key = $(element).data("key");
			var obj = this.properties;
			var arr = key ? key.split(".") : [];

			if(arguments.length === 2){
				for(var i=0; i<arr.length; i++){
					if(i !== arr.length - 1){
						obj = obj[arr[i]];
					}else{
						obj[arr[i]] = value;
					}
				}
			}else{
				for(var i=0; i<arr.length; i++){
					obj = obj[arr[i]];
				}
				return obj;
			}
		},

		activiti_id: function(){},

		business_data: function(){
			return {};
		},

		/**
		 * 标记选中对象
		 */
		mark: function(){
			if(this.name === "end"){
				$("#settings, .editor").removeClass("status");
				$("#settings > div").attr("style", "");
			}else{
				$("#settings > div").attr("style", "display:none");
				$("#" + this.set.name).attr("style", "");
				$("#settings,.editor").addClass("status");
			}
			$("#svg g[id]").attr("class", "");
			$(this.dom).attr("class", "mark");
		},

		/**
		 * 销毁对象
		 */
		destroy: function(){
			$(this.dom).removeData().remove();
			this.parent = null;
			this.dom = null;
			this.target = null;
			this.set = null;
		},

		/**
		 * 验证当前对象的值
		 */
		validation: function(){
			return true;
		},

		show_error_message: function(message){
			$("#alert").fadeIn(200,function(){
				$(".alert-body", this).html(message);
				$(".alert", this).addClass("status");
			});
			$(document.body).addClass("modal-open");
		},

		/**
		 * 选取操作
		 */
		select: function(){},

		/**
		 * 对象click事件
		 */
		click: function(){
			var _this = this;
			$(this.dom).click(function(){
				_this.sync_pos(_this.x - 4, _this.y - 4);

				// 打开属性设置窗口
				_this.set.show(_this);
				_this.mark();

				return false;
			});
		},

		sync_pos: function(x, y){
			var size = this.size();
			var gid_selected = $("#gid_selected");
			gid_selected.attr({display: "",transform: "translate("+x+", "+y+")"});
			$("rect", gid_selected).attr({width: size.width+8, height: size.height+8});
		},
		
		/**
		 * 获取元素尺寸
		 */
		size: function(){},

		/**
		 * 获取元素相对定位
		 */
		position: function(){
			var cur_position = $(this.dom).offset();
			var svg_position = $("svg").offset();
			return {
				x: cur_position.left - svg_position.left,
				y: cur_position.top - svg_position.top
			};
		},

		center: function(){
			var size = this.size();
			return {
				x: this.x + size.width / 2,
				y: this.y + size.height / 2
			};
		},

		/**
		 * 对象contextmenu事件
		 */
		contextmenu: function(){},

		//函数节流
		throttle: function(handler){
			var starttime = new Date();
			var timeoutid = null;			
			return function(){
				console.log('move');
				var aArgs = arguments;
				var _that = this;
				var currenttime = new Date();
				clearTimeout(timeoutid);
				if(currenttime - starttime >= 50){
					starttime = currenttime;
					handler.apply(_that, aArgs);
				}else{
					timeoutid = setTimeout(function(){
						handler.apply(_that, aArgs);
					}, 50);
				}
			};
		},

		/**
		 * 对象drag事件
		 */
		drag: function(){
			var _this = this;
			var svg = document.querySelector("svg")
			var doc = $(svg.ownerDocument);
			var size = _this.size();
			var x = y = 0;
			var init_x = init_y = 0;
			var min_x = min_y = 4;
			var max_x = 0;
			var max_y = 0;
			var is_move = false;
			var pos_x = pos_y = 0;

			var _moveThrottle = _this.throttle(_move);

			$(_this.dom).mousedown(function(e){
				max_x = $(svg).width() - size.width - 4;
				max_y = $(svg).height() - size.height - 4;
				_this.sync_pos(_this.x - 4, _this.y - 4);
				init_x = e.pageX;
				init_y = e.pageY;
				pos_x = _this.x;
				pos_y = _this.y;
				doc.on("mousemove", _moveThrottle).on("mouseup", _up);

			});

			function _move(e){
				//
				console.log('--run--');

				is_move = true;

				x = pos_x + e.pageX - init_x;
				y = pos_y + e.pageY - init_y;

				if(x < min_x){
					x = min_x;
				}else if(x > max_x){
					x = max_x;
				}

				if(y < min_y){
					y = min_y;
				}else if(y > max_y){
					y = max_y;
				}

				_this.x = x;
				_this.y = y;

				$(".stencils, .magnets", _this.dom).attr("transform", "translate("+x+", "+y+")");

				_this.sync_pos(x-4, y-4);

				$("#svg_edge > g").each(function(){
					var target = $(this).data("target");
					
					if($("#" + target.sourceRef).data("target") === _this){
						target.dync_calc_pos(target.sourceRef, false);
						if(target.targetRef){
							target.dync_calc_pos(target.targetRef, true);
						}
					}else if($("#" + target.targetRef).data("target") === _this){
						target.dync_calc_pos(target.targetRef, true);
						if(target.sourceRef){
							target.dync_calc_pos(target.sourceRef, false);
						}
					}
				});
			}
			function _up(e){
				is_move = false;

				doc.off("mousemove", _moveThrottle).off("mouseup", _up);
			}
		},
		
		to_xml: function(){}
	};

	return PDGraph;
});