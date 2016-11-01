require.config({
	paths: {
		jquery: "jquery-2.1.3.min",
		jquery_ui: "jquery-ui.custom.min"
	},
	shim: {
		jquery_ui: ["jquery"]
	}
});

require(["jquery", "pd_page"], function($, PDPage){
	new PDPage();
});