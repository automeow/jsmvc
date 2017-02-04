require("./helpers/hash.js");

var Router = require("./router/router.js"),
	Controllers = require("./controllers/controllers.js"),
	Views = require("./views/views.js"),
	Layout = require("./layout/layout.js"),
	Models = require("./models/models.js"),
	Debug = require("./debug/debug.js");

module.exports = {
	opts: {},

	init: function(opts) {
		console.log("init");
		this.opts = opts || {};
		this.callConfigs();
		this.setupCallbacks();
		this.onRoute();
	},

	callConfigs: function() {
		Debug.callConfig(this);
		Models.callConfig(this);
		Router.callConfig(this);
		Controllers.callConfig(this);
		Views.callConfig(this);
		Layout.callConfig(this);
	},

	setupCallbacks: function() {
		var self = this;
		window.onhashchange = function() {
			self.onRoute();
		};
	},

	onRoute: function() {
		var self = this;
		this.params = this.params || {};

		if (self.controller && self.controller._rewrite) {
			self.controller._rewrite = null;

			return;
		}

		this.catchErrors(function() {
			self.route = Router.getRoute();

			if (self.params.id === undefined) {
				for (var i = self.route.parts.length - 1; i >= 0; i--) {
					if (self.route.parts[i].value) {
						self.params.id = self.route.parts[i].value;
						break;
					}
				}
			}
			self.controller = Controllers.callAction(self.route, self.params);
			if (!Models.blocked) {
				self.doneWaiting();
			}
		});
	},

	doneWaiting: function() {
		var self = this;
		this.catchErrors(function() {
			Models.throwUnhandled();

			if (self.controller._error) {
				Views.stopLoading();
				Views.showError(self.controller._error);
			} else if (!self.controller._redirected) {
				Views.callAction(self.route, self.controller, self.params);
				Views.stopLoading();

				if (self.controller.afterView) {
					self.controller.afterView(self.route.action);
				}
			}
		});

		this.params = {};
	},

	catchErrors: function(f) {
		try {
			f();
		} catch(e) {
			if (e.mvc) {
				Views.showError(e);
			} else {
				console.log(e);
				Views.showError("Internal error");
			}
			Views.stopLoading();
		}
	},

	submitForm: function(path, params) {
		this.params = params;
		window.location.hash = path;
	},

	showLoading: function() {
		Views.showLoading();
	},

	stopLoading: function() {
		this.doneWaiting();
	}
};
