/* globals Promise */

var INSTANCE_OVERRIDES = ["save", "destroy"],
	STATIC_OVERRIDES   = ["all", "find", "find_by", "where"],
	Debug = require("../debug/debug.js"),
	_ = require("underscore");

module.exports = function(Models, Adapter) {
	function Model(attributes) {
		Adapter.apply(this, arguments);
		this.attributes = {};
		this.set(attributes || {});
	}
	Object.assign(Model, Adapter);
	Model._busy = 0;
	Model.prototype = Object.create(Adapter.prototype);

	for (var i = 0; i < INSTANCE_OVERRIDES.length; i++) {
		if (!Model.prototype[INSTANCE_OVERRIDES[i]]) {
			Debug.warn(Adapter, "Instance function should be overwritten: " + INSTANCE_OVERRIDES[i]);
		}
	}

	for (var i = 0; i < STATIC_OVERRIDES.length; i++) {
		if (!Model[STATIC_OVERRIDES[i]]) {
			Debug.warn(Adapter, "Static function should be overwritten: " + STATIC_OVERRIDES[i]);
		}
	}

	Model.prototype.set = function(name_or_object, value) {
		if (arguments.length == 2) {
			this.attributes[name_or_object] = value;
			this._add_helper(name_or_object);
		} else {
			for (var p in name_or_object) {
				if (name_or_object.hasOwnProperty(p)) {
					this.set(p, name_or_object[p]);
				}
			}
		}
	};

	Model.prototype.get = function(name) {
		this._add_helper(name);

		return this.attributes[name];
	};

	Model.prototype._add_helper = function(name) {
		if (typeof this[name] !== "function") {
			this[name] = this.attributes[name];
		}
	};

	Model.prototype.update = function(attributes) {
		this.set(attributes);

		return this.save();
	};

	Model._done = function(f) {
		return function() {
			Model._busy--;

			if (f) {
				try {
					f.apply(this, arguments);
				} catch(e) {
					Models.error(e);
				}
			}

			setTimeout(function() {
				if (Model._busy === 0) {
					Models.done();
				}
			}, 0);
		};
	};

	Model._error = function(f) {
		return Model._done(function(error) {
			Models.error(error);

			if (f) {
				f.apply(this, arguments);
			}
		});
	};

	Model._wait = function() {
		Model._busy++;

		if (Model._busy === 1) {
			Models.waiting();
		}
	};

	Model.prototype.save = function() {
		return new Promise(_.bind(function(resolve, reject) {
			Debug.log(this, "save");
			Model._wait();
			Adapter.prototype.save.call(this, Model._done(resolve), Model._error(reject));
		}, this));
	};

	Model.prototype.destroy = function() {
		return new Promise(_.bind(function(resolve, reject) {
			Debug.log(this, "destroy");
			Model._wait();
			Adapter.prototype.destroy.call(this, Model._done(resolve), Model._error(reject));
		}, this));
	};

	Model.all = function() {
		return new Promise(_.bind(function(resolve, reject) {
			Debug.log(this, "all");
			Model._wait();
			Adapter.all.call(this, Model._done(resolve), Model._error(reject));
		}, this));
	};

	Model.find = function(id) {
		return new Promise(_.bind(function(resolve, reject) {
			Debug.log(this, "find: " + id);
			Model._wait();
			Adapter.find.call(this, id, Model._done(resolve), Model._error(reject));
		}, this));
	};

	Model.find_by = function(opts) {
		return new Promise(_.bind(function(resolve, reject) {
			Debug.log(this, "find_by");
			Model._wait();
			Adapter.find_by.call(this, opts, Model._done(resolve), Model._error(reject));
		}, this));
	};

	Model.where = function(opts) {
		return new Promise(_.bind(function(resolve, reject) {
			Debug.log(this, "where");
			Model._wait();
			Adapter.where.call(this, opts, Model._done(resolve), Model._error(reject));
		}, this));
	};

	return Model;
};
