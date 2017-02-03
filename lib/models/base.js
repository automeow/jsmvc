var INSTANCE_OVERRIDES = ["save", "destroy"],
	STATIC_OVERRIDES   = ["all", "find", "find_by", "where"],
	Debug = require("../debug/debug.js");

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

	Model.prototype.update = function(attributes, data, error) {
		this.set(attributes);
		this.save(data, error);
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

			if (Model._busy === 0) {
				Models.done();
			}
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

		if (Model._busy == 1) {
			Models.waiting();
		}
	};

	Model.prototype.save = function(data, error) {
		Debug.log(this, "save");
		Model._wait();
		Adapter.prototype.save.call(this, Model._done(data), Model._error(error));
	};

	Model.prototype.destroy = function(success, error) {
		Debug.log(this, "destroy");
		Model._wait();
		Adapter.prototype.destroy.call(this, Model._done(success), Model._error(error));
	};

	Model.all = function(data, error) {
		Debug.log(this, "all");
		Model._wait();
		Adapter.all.call(this, Model._done(data), Model._error(error));
	};

	Model.find = function(id, data, error) {
		Debug.log(this, "find: " + id);
		Model._wait();
		Adapter.find.call(this, id, Model._done(data), Model._error(error));
	};

	Model.find_by = function(opts, data, error) {
		Debug.log(this, "find_by");
		Model._wait();
		Adapter.find_by.call(this, opts, Model._done(data), Model._error(error));
	};

	Model.where = function(opts, data, error) {
		Debug.log(this, "where");
		Model._wait();
		Adapter.where.call(this, opts, Model._done(data), Model._error(error));
	};

	return Model;
};
