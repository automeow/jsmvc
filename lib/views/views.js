/* globals $ */
var render = require("./helpers.js").get().render,
	Layout = require("../layout/layout.js"),
	Guiders = require("./guiders.js");

module.exports = {
	list: {},

	callConfig: function(MVC) {
		this.list = MVC.opts.views;
		this.MVC = MVC;
	},

	callAction: function(route, controller, params) {
		Layout.setContent(
			render(
				this.list[route.resource.name][controller._renderer],
				{ c: controller, params: params }
			)
		);
		Guiders.pageLoaded(this.MVC);
	},

	showError: function(error) {
		var current = Layout.use;

		if (Layout.layouts.error) {
			Layout.use = "error";
		}

		if (this.list.error) {
			Layout.setContent(
				render(
					this.list.error,
					{ e: error }
				)
			);
		} else {
			Layout.setContent(error.code || error);
		}

		Layout.use = current;
	},

	showLoading: function() {
		if (typeof this.list.loading !== "string") {
			return;
		}

		if (!$(".loading").length) {
			$("body").append(
				$("<div />")
					.addClass("loading")
					.html(render(this.list.loading))
			);
		}
	},

	stopLoading: function() {
		$(".loading").remove();
	}
};
