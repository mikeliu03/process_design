define(["jquery", "utils", "pd_graph", "config"], function($, utils, PDGraph, config){
	/**
	 * 页面节点: new editor node
	 */
	function PDCableGraph(opt){
		if(this === window) return;
		this.init(opt);
	}

	PDCableGraph.prototype = utils.inherit(PDGraph.prototype);
	utils.extend(PDCableGraph.prototype, {
		constructor: PDCableGraph,
		
		name: "line",		// 别名
		
		parent: document.querySelector("#svg_edge"),

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
			this.lineId = this.lineId || "L" + this.simple_id();
			//this.sourceRef = this.sourceRef && $("#" + this.sourceRef).data("target");
			//this.targetRef = this.targetRef && $("#" + this.targetRef).data("target");

			var start_x = +this.startX, start_y = +this.startY;
			var end_x = +this.endX, end_y = +this.endY;

			structure.attr.id = this.id;
			

			// 初始化样式
			this.init_style(structure, this.parent);

			this.re_position();

			// 初始化事件
			this.init_event();

			// 绑定对象
			$(this.dom).data("target", this);
		},
		
		size: function(){
			var p = $("path", this.dom)[0].getBoundingClientRect();
			return {width: p.width, height: p.height};
		},
		
		re_position: function(){
			var context = this.dom;
			$("path", context).attr("d", "M"+this.startX+" "+this.startY+"L"+this.endX+" "+this.endY);
			$(".magnets > g:first > g", context).attr("transform", "translate("+(this.startX-8)+", "+(this.startY-8)+")");
			$(".magnets > g:last > g", context).attr("transform", "translate("+(this.endX-8)+", "+(this.endY-8)+")");
		},
		
		click: function(){
			var _this = this;
			$(_this.dom).click(function(){
				_this.sync_pos(Math.min(_this.startX, _this.endX) - 4, Math.min(_this.startY, _this.endY) - 4);

				// 打开属性设置窗口
				_this.set.show(_this);
				_this.mark();

				return false;
			}).mouseenter(function(){
				$(".magnets > g > g", _this.dom).attr("display", "");
			}).mouseleave(function(){
				$(".magnets > g > g", _this.dom).attr("display", "none");
			});
		},
		
		drag: function(){
			var _this = this;
			var svg = document.querySelector("svg")
			var doc = $(svg.ownerDocument);
			var x = y = 0;
			var init_x = init_y = 0;
			var min_x = min_y = 4;
			var max_x = max_y = 0;
			var is_move = false;
			var d = "";
			var start_x = start_y = end_x = end_y = 0;
			var start_point = $(".magnets > g:first > g", _this.dom);
			var end_point = $(".magnets > g:last > g", _this.dom);
			var path = $("path", _this.dom);

			path.mousedown(function(e){
				var size = _this.size();
				max_x = $(svg).width() - size.width - 4;
				max_y = $(svg).height() - size.height - 4;
				_this.sync_pos(Math.min(_this.startX, _this.endX) - 4, Math.min(_this.startY, _this.endY) - 4);
				init_x = e.pageX;
				init_y = e.pageY;
				doc.on("mousemove", _move).on("mouseup", _up);
			});

			function _move(e){
				// 是否可以拖拽
				var is_drag = _this._is_drag();
				if(!is_drag) return false;

				is_move = true;

				x = Math.min(_this.startX, _this.endX) + e.pageX - init_x;
				y = Math.min(_this.startY, _this.endY) + e.pageY - init_y;

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

				var rect = _this.size();

				if(_this.startX < _this.endX && _this.startY >= _this.endY){
					start_x = x;
					start_y = y + rect.height;
					end_x = x+rect.width;
					end_y = y;
				}else if(_this.startX > _this.endX && _this.startY <= _this.endY){
					start_x = x+rect.width;
					start_y = y;
					end_x = x;
					end_y = y+rect.height;
				}else if(_this.startY > _this.endY && _this.startX >= _this.endX){
					start_x = x+rect.width;
					start_y = y+rect.height;
					end_x = x;
					end_y = y;
				}else if(_this.startY < _this.endY && _this.startX <= _this.endX){
					start_x = x;
					start_y = y;
					end_x = x+rect.width;
					end_y = y+rect.height;
				}
			
				//_this.re_position();
				path.attr("d", "M"+start_x+" "+start_y+"L"+end_x+" "+end_y);
				start_point.attr("transform", "translate("+(start_x-8)+", "+(start_y-8)+")");
				end_point.attr("transform", "translate("+(end_x-8)+", "+(end_y-8)+")");

				_this.sync_pos(x-4, y-4);
			}

			function _up(e){
				if(is_move){
					_this.startX = start_x;
					_this.startY = start_y;
					_this.endX = end_x;
					_this.endY = end_y;
					is_move = false;
				}

				doc.off("mousemove", _move).off("mouseup", _up);
			}
			
			var svg_fobidden = $("#svg_fobidden");
			var svg_active = $("#svg_active");
			var start_is_move = false;
			var start_active = null;
			start_point.mousedown(function(e){
				doc.on("mousemove", _start_move).on("mouseup", _start_up);
			});

			function _start_move(e){
				start_is_move = true;
				_this.startX = e.offsetX;
				_this.startY = e.offsetY;

				// 判断当前位置是否有其他节点，start不能连接结束节点
				var childrens = $("#svg_children > g");
				var cur = null;
				var cur_position = null;
				var cur_size = null;
				for(var i=0; i<childrens.length; i++){
					cur = $(childrens[i]).data("target");
					cur_size = cur.size();
					if(_this.startX >= cur.x && _this.startX <= cur.x + cur_size.width && _this.startY >= cur.y && _this.startY <= cur.y + cur_size.height){
						start_active = cur;
						break;
					}
					if(i === childrens.length - 1) start_active = null;
				}
				
				if(start_active){
					if(start_active.name === "end"){
						svg_active.hide();
						svg_fobidden.css({
							display: "block",
							top: start_active.y - 6,
							left: start_active.x - 6,
							width: cur_size.width + 8,
							height: cur_size.height + 8
						});
					}else{
						svg_fobidden.hide();
						svg_active.css({
							display: "block",
							top: start_active.y - 6,
							left: start_active.x - 6,
							width: cur_size.width + 8,
							height: cur_size.height + 8
						});
						$(".magnets > g", start_active.dom).attr("display", "");
					}
				}else{
					_this.sourceRef = "";
					svg_active.hide();
					svg_fobidden.hide();
					childrens.each(function(){
						$(".magnets > g", this).attr("display", "none");
					});
				}
				
				_this.re_position();
				if(_this.targetRef){
					_this.dync_calc_pos(_this.targetRef, true);
				}

				return false;
			}

			function _start_up(e){
				if(start_is_move){
					// 如果有其他节点，判断是否吸附，并判断吸附的位置， 如果成功吸附，需要改变sourceRef属性
					if(start_active && svg_active.css("display") !== "none"){
						_this.sourceRef = start_active.dom.id;

						if(start_active.name === "task"){
							start_active.properties.node_attributes.lines.push(_this.dom.id);
						}

						// 重新计算起点位置: this.startX this.startY
						_this.dync_calc_pos(start_active, false);
						
						$(".magnets > g", start_active.dom).attr("display", "none");
						svg_active.hide();
					}else{
						$("#svg_children > g").each(function(){
							var target = $(this).data("target");
							if(target.name === "task"){
								var index = target.properties.node_attributes.lines.indexOf(_this.dom.id);
								if(index >= 0) target.properties.node_attributes.lines.splice(index, 1);
							}
						});
					}

					svg_fobidden.hide();

					start_is_move = false;
				}
				doc.off("mousemove", _start_move).off("mouseup", _start_up);
			}

			var end_is_move = false;
			var end_active = null;
			end_point.mousedown(function(e){
				doc.on("mousemove", _end_move).on("mouseup", _end_up);
			});

			function _end_move(e){
				end_is_move = true;
				_this.endX = e.offsetX;
				_this.endY = e.offsetY;
				
				// 判断当前位置是否有其他节点，start不能连接结束节点
				var childrens = $("#svg_children > g");
				var cur = null;
				var cur_position = null;
				var cur_size = null;
				for(var i=0; i<childrens.length; i++){
					cur = $(childrens[i]).data("target");
					cur_size = cur.size();
					if(_this.endX >= cur.x && _this.endX <= cur.x + cur_size.width && _this.endY >= cur.y && _this.endY <= cur.y + cur_size.height){
						end_active = cur;
						break;
					}
					if(i === childrens.length - 1) end_active = null;
				}
				
				if(end_active){
					if(end_active.name === "start"){
						svg_active.hide();
						svg_fobidden.css({
							display: "block",
							top: end_active.y - 6,
							left: end_active.x - 6,
							width: cur_size.width + 8,
							height: cur_size.height + 8
						});
					}else{
						svg_fobidden.hide();
						svg_active.css({
							display: "block",
							top: end_active.y - 6,
							left: end_active.x - 6,
							width: cur_size.width + 8,
							height: cur_size.height + 8
						});
						$(".magnets > g", end_active.dom).attr("display", "");
					}
				}else{
					_this.targetRef = "";
					svg_active.hide();
					svg_fobidden.hide();
					childrens.each(function(){
						$(".magnets > g", this).attr("display", "none");
					});
				}
				
				_this.re_position();
				if(_this.sourceRef){
					_this.dync_calc_pos(_this.sourceRef, false);
				}

				return false;
			}

			function _end_up(e){
				if(end_is_move){
					// 如果有其他节点，判断是否吸附，并判断吸附的位置， 如果成功吸附，需要改变sourceRef属性
					if(end_active && svg_active.css("display") !== "none"){
						_this.targetRef = end_active.dom.id;
						
						if(end_active.name === "task"){
							end_active.properties.node_attributes.lines.push(_this.dom.id);
						}

						// 重新计算起点位置: this.startX this.startY
						_this.dync_calc_pos(end_active, true);

						$(".magnets > g", end_active.dom).attr("display", "none");
						svg_active.hide();
					}else{
						$("#svg_children > g").each(function(){
							var target = $(this).data("target");
							if(target.name === "task"){
								var index = target.properties.node_attributes.lines.indexOf(_this.dom.id);
								if(index >= 0) target.properties.node_attributes.lines.splice(index, 1);
							}
						});
					}
					svg_fobidden.hide();

					end_is_move = false;
				}
				doc.off("mousemove", _end_move).off("mouseup", _end_up);
			}
		},

		dync_calc_pos: function(target, flag){
			if(typeof target === "string"){
				target = $("#" + target).data("target");
			}
			var center = target.center();
			var size = target.size();
			var cx = center.x, cy = center.y;
			var sx = sy = 0;
			var angle = size.height / size.width;
			var clac_angle = un_calc_angle = 0;
			var calc_x = calc_y = 0;

			if(flag){
				sx = this.startX;
				sy = this.startY;
			}else{
				sx = this.endX;
				sy = this.endY;
			}

			calc_x = sx - cx;
			calc_y = sy - cy;
			clac_angle = Math.abs(calc_x / calc_y);
			un_calc_angle = Math.abs(calc_y / calc_x);

			if(un_calc_angle > angle){
				sx = center.x + (calc_x > 0 ? 1 : -1) * clac_angle * size.width / 2;
				sy = center.y + (calc_y > 0 ? 1 : -1) * size.height / 2;
			}else{
				sx = center.x + (calc_x > 0 ? 1 : -1) * size.width / 2;
				sy = center.y + (calc_y > 0 ? 1 : -1) * un_calc_angle * size.height / 2;
			}
			
			if(!flag){
				this.startX = sx;
				this.startY = sy;
			}else{
				this.endX = sx;
				this.endY = sy;
			}
			this.re_position();
		},
		
		_is_drag: function(){
			if(this.sourceRef || this.targetRef) return false;

			return true;
		},

		validation: function(){
			var prefix = this.set.prefix;

			// 验证流转条件表达式
//			if(this.attr($(prefix + "express")) === ""){
//				this.show_error_message("请输入流转条件表达式");
//				$(this.dom).click();
//				return false;
//			}
			
			if(!this.sourceRef || ! this.targetRef){
				this.show_error_message("连接线2端必须连接其他类型节点");
				$(this.dom).click();
				return false;
			}
			return true;
		},

		business_data: function(){
			var source = $("#" + this.sourceRef).data("target");
			var target = $("#" + this.targetRef).data("target");
			var source_ref = source && source.dom.id || "";
			var target_ref = target && target.dom.id || "";
			var source_name = target_name = "";

			for(var obj in this.properties){
				this.properties[obj].nodeId = this.lineId;
			}

			if(source_ref){
				source_name = source.attr($(source.set.prefix + "name"));
			}
			if(target_ref){
				target_name = target.name === "end" ? "结束节点" : target.attr($(target.set.prefix + "name"));
			}

			this.properties.node_attributes.showType = source_name + "-" + target_name;
			this.properties.node_attributes.sourceRef = source.activiti_id();
			this.properties.node_attributes.targetRef = target.activiti_id();

			return {
				flow_node: {
					elem_type: "line",
					startX: this.startX,
					startY: this.startY,
					endX: this.endX,
					endY: this.endY,
					sourceRef: source_ref,
					targetRef: target_ref,
					id: this.dom.id,
					lineId: this.lineId,
				},
				properties: this.properties
			};
		},

		_get_aim_id: function(id){
			var aim = $("#" + id);
			if(aim.length <= 0) return "";
			return aim.data("target").activiti_id();
		},

		to_xml: function(){
			var xml = '<sequenceFlow id="'+this.lineId+'" name="'+this.lineId+'" sourceRef="'+this._get_aim_id(this.sourceRef)+'" targetRef="'+this._get_aim_id(this.targetRef)+'">\n';
			xml += '<conditionExpression xsi:type="tFormalExpression"><![CDATA[${'+this.lineId+'}]]></conditionExpression>\n';
			xml+='</sequenceFlow>\n';
			return xml;
		},
		
		to_bpm: function(){
			var size = this.size();
			var xml = '<bpmndi:BPMNEdge bpmnElement="'+this.lineId+'" id="BPMNEdge_'+this.lineId+'">\n';
			xml+='<omgdi:waypoint x="'+this.startX+'" y="'+this.startY+'"/>\n';
			xml+='<omgdi:waypoint x="'+this.endX+'" y="'+this.endY+'"/>\n';
			xml=xml+'</bpmndi:BPMNEdge>\n';
			return xml;
		},

		destroy: function(){
			var _this = this;
			
			$("#svg_children > g").each(function(){
				var target = $(this).data("target");
				if(target.name === "task"){
					var index = target.properties.node_attributes.lines.indexOf(_this.dom.id);
					if(index >= 0) target.properties.node_attributes.lines.splice(index, 1);
				}
			});
			PDGraph.prototype.destroy.call(this);
		}
	});

	return PDCableGraph;
});