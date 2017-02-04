Object.prototype.reverse_merge = function(opts) {
	for (var p in opts) {
		if (opts.hasOwnProperty(p)) {
			if (this.hasOwnProperty(p)) {
				continue;
			}
			this[p] = opts[p];
		}
	}
};

Object.prototype.merge = function(opts) {
	for (var p in opts) {
		if (opts.hasOwnProperty(p)) {
			this[p] = opts[p];
		}
	}
};

Object.prototype.is_or_includes = function(string) {
	if (typeof this === "object") {
		for (var p in this) {
			if (this.hasOwnProperty(p)) {
				if (this[p] === string) {
					return true;
				}
			}
		}
	}

	return this.toString() === string;
};

Object.prototype.values = function() {
	var v = [];

	for (var p in this) {
		if (this.hasOwnProperty(p)) {
			v.push(this[p]);
		}
	}

	return v;
};

Object.prototype.tap = function(f) {
	f(this);

	return this;
};

Array.prototype.minus = function(a) {
    return this.filter(function(i) { return a.indexOf(i) < 0; });
};

Array.wrap = function(obj) {
	if (!obj) {
		return [];
	}

	if (obj.constructor.name == "Array") {
		return obj;
	}

	return [obj];
};

module.exports = Object;