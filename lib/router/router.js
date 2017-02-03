var Resource = require("./resource.js");

module.exports = {
	routes: [],
	resources: [],
	root: null,

	callConfig: function(MVC) {
		this.resources = (new Resource("temp", {}, MVC.opts.resources)).children;

		for (var i = 0; i < this.resources.length; i++) {
			this.routes = this.routes.concat(this.resources[i].makeRoutes());

			this.root = this.root || this.resources[i].getRoot();
		}
	},

	getRoute: function() {
		if (window.location.hash.length) {
			var parts = window.location.hash.substring(1).split("/"),
				cleansed = [];

			for (var i = 0; i < parts.length; i++) {
				if (parts[i].length) {
					cleansed.push(parts[i]);
				}
			}

			for (var i = 0; i < this.routes.length; i++) {
				if (this.routes[i].match(cleansed)) {
					return this.routes[i];
				}
			}

			return null;
		}

		return this.root;
	}
};
