var ejs = require("ejs");

var helpers = {
	render: function(string, vars) {
		vars = vars || {};
		vars.merge(helpers);

		return ejs.render(string, vars);
	}
};

module.exports = {
	add: function(name, f) {
		helpers[name] = f;
	},

	get: function() {
		return helpers;
	}
};
