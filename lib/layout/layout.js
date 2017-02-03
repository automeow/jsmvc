var uuid = require("../helpers/uuid.js"),
	ejs = require("ejs"),
	BaseController = require("../controllers/base.js");

module.exports = {
	layouts: {},
	layout_ids: {},
	use: "default",
	base_controller: new BaseController(),

	callConfig: function(MVC) {
		var self = this;
		this.layouts = MVC.opts.layouts;

		for (var p in this.layouts) {
			if (this.layouts.hasOwnProperty(p)) {
				this.layout_ids[p] = "content_" + uuid();
			}
		}

		window.onscroll = function() {
			self.onScroll.apply(self, arguments);
		};
		this.onScroll();
	},

	setContent: function(html) {
		this.preload();
		document.getElementById(this.layout_ids[this.use]).innerHTML = html;
	},

	preload: function() {
		if (!document.getElementById(this.layout_ids[this.use])) {
			document.body.setAttribute("data-layout", this.use);
			document.body.innerHTML = ejs.render(this.layouts[this.use], { content_id: this.layout_ids[this.use], c: this.base_controller });
		}
	},

	onScroll: function() {
		document.body.setAttribute("data-scroll", document.body.scrollTop);
	}
};
