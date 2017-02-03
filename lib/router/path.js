function Path(name) {
	this.name = name;
}

Path.prototype.match = function(pathPart) {
	return this.name == pathPart;
};

Path.prototype.helper = function(pathBuilder) {
	pathBuilder.folder(this.name);
};

module.exports = Path;
