function Base(params) {
	this.params = params || {};
	this._error = null;
}

Base.prototype.render = function(name) {
	this._renderer = name;
};

Base.prototype.model = function(className) {
	return this._models[className];
};

Base.prototype.rewrite = function(path) {
	window.location.href = path;
	this._rewrite = true;
};

Base.prototype.redirect = function(path) {
	window.location.href = path;
	this._redirected = true;
};

Base.prototype.showError = function(error) {
	this._error = error;
};

module.exports = Base;
