var Path = require("./path");

function PathId() {
	Path.apply(this, arguments);
	this.value = null;
}
PathId.prototype = Object.create(Path.prototype);

PathId.prototype.match = function(pathPart) {
	this.value = pathPart;

	return pathPart.match(/^[0-9]+$/);
};

PathId.prototype.helper = function(pathBuilder) {
	pathBuilder.id();
};

module.exports = PathId;
