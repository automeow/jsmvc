var baseF = require("./base.js"),
	Errors = require("../errors/errors.js"),
	Debug = require("../debug/debug.js");

module.exports = {
	name: "Models",
	models: {},
	errors: [],
	blocked: false,

	callConfig: function(MVC) {
		this.Base = baseF(this, MVC.opts.model_adapter(Errors));
		this.MVC = MVC;

		for (var p in MVC.opts.models) {
			if (MVC.opts.models.hasOwnProperty(p)) {
				this.models[p] = MVC.opts.models[p](this.Base);
			}
		}
	},

	throwUnhandled: function() {
		var errors = this.errors;
		this.errors = [];

		for (var i = 0; i < errors.length; i++) {
			if (!errors[i].handled) {
				throw errors[i];
			}
		}
	},

	error: function(e) {
		this.errors.push(e);
	},

	waiting: function() {
		Debug.log(this, "model loading");
		this.blocked = true;
		this.MVC.showLoading();
	},

	done: function() {
		Debug.log(this, "model done");
		this.blocked = false;
		this.MVC.stopLoading();
	}
};
