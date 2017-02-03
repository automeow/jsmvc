module.exports = {
	debug_mode: false,

	callConfig: function(MVC) {
		this.debug_mode = MVC.opts.debug;
	},

	log: function(klass, message) {
		if (this.debug_mode) {
			console.log("[" + this.getClassName(klass) + "] " + message);
		}
	},

	warn: function(klass, message) {
		if (this.debug_mode) {
			console.warn("[" + this.getClassName(klass) + "] " + message);
		}
	},

	getClassName: function(klass) {
		if (typeof klass === "string") {
			return klass;
		}

		if (!["Object", "Function"].is_or_includes(klass.constructor.name)) {
			return "Instance: " + klass.constructor.name;
		}

		if (klass.name) {
			return "Static: " + klass.name;
		}

		return "Object";
	}
};
