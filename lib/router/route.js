function Route(resource, action, pathParts, isRoot) {
	this.resource = resource;
	this.action = action;
	this.parts = pathParts;
	this.root = isRoot;
}

Route.prototype.match = function(rawPathParts) {
	if (rawPathParts.length != this.parts.length) {
		return false;
	}

	for (var i = 0; i < rawPathParts.length; i++) {
		if (!this.parts[i].match(rawPathParts[i])) {
			return false;
		}
	}

	return true;
};

module.exports = Route;
