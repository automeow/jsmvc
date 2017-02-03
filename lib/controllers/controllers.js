var Base = require("./base.js"),
	Router = require("../router/router.js"),
	PathBuilder = require("./path_builder.js"),
	Models = require("../models/models.js");

module.exports = {
	list: {},
	pathHelpers: {},

	callConfig: function(MVC) {
		for (var i = 0; i < Router.routes.length; i++) {
			this.addPathHelpers(Router.routes[i]);
		}

		for (var c in MVC.opts.controllers) {
			if (MVC.opts.controllers.hasOwnProperty(c)) {
				this.list[c] = MVC.opts.controllers[c](Base);
			}
		}
	},

	callAction: function(route, params) {
		var Controller = this.list[route.resource.name],
			controller = new Controller(params);
		controller._models = Models.models;
		controller.render(route.action);
		controller[route.action]();

		return controller;
	},

	addPathHelpers: function(route) {
		var self = this,
			pathBuilder = new PathBuilder(),
			name;

		for (var i = 0; i < route.parts.length; i++) {
			route.parts[i].helper(pathBuilder);
		}

		name = pathBuilder.name();

		this.registerHelper(
			name,
			function() {
				return self.pathDistributor(this, name, arguments);
			}
		);

		this.pathHelpers[name] = this.pathHelpers[name] || {};
		this.pathHelpers[name][pathBuilder.args] = route.root ? function() { return "#"; } : pathBuilder.export();
	},

	registerHelper: function(name, func) {
		Base.prototype[name] = func;
	},

	pathDistributor: function(controller, name, args) {
		return this.pathHelpers[name][args.length].apply(this, args);
	}
};
