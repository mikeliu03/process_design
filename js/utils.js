define(["jquery"], function($){
	/**
	 * 对象属性合并方法，将第二个以后的所有参数（对象）的属性合并到第一个参数（对象）中
	 */
	function extend(){
		var extend_obj = arguments[0];
		var obj = null

		for(var i=1; i<arguments.length; i++){
			obj = arguments[i];
			for(var key in obj){
				//if(!extend_obj[key]){
					extend_obj[key] = obj[key];
				//}
			}
		}

		return extend_obj;
	}

	/**
	 * 继承通用函数
	 */
	function inherit(proto){
		function f(){}
		f.prototype = proto;
		return new f();
	}

	function show_error_message(message){
		$("#alert").fadeIn(200,function(){
			$(".alert-body", this).html(message);
			$(".alert", this).addClass("status");
		});
		$(document.body).addClass("modal-open");
	}

	return {
		extend: extend,
		inherit: inherit,
		show_error_message: show_error_message
	};
});