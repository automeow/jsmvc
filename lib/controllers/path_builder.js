function PathBuilder() {
	this.path = [];
	this.folders = [];
	this.args = 0;
}

PathBuilder.prototype.folder = function(path) {
	this.path.push(function() { return path; });
	this.folders.push(path);
};

PathBuilder.prototype.id = function() {
	var argNum = this.args;
	this.path.push(function(args) {
		return args[argNum];
	});
	this.args++;
};

PathBuilder.prototype.name = function() {
	return this.folders.concat("path").join("_");
};

PathBuilder.prototype.export = function() {
	var self = this;

	return function() {
		return PathBuilder.prototype.build.apply(self, arguments);
	};
};

PathBuilder.prototype.build = function() {
	var parts = [];

	for (var i = 0; i < this.path.length; i++) {
		parts.push(this.path[i](arguments));
	}

	return "#" + parts.join("/");
};

module.exports = PathBuilder;
