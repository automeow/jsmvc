var Route = require("./route.js"),
	Path = require("./path.js"),
	Id = require("./id.js");

var ROUTE_TYPES = {
	index:   [],
	new:     [new Path("new")],
	create:  [new Path("create")],
	show:    [new Id("id")],
	edit:    [new Id("id"), new Path("edit")],
	update:  [new Id("id"), new Path("update")],
	destroy: [new Id("id"), new Path("destroy")],
};

function Resource(name, opts, subResources) {
	this.name = name;
	this.opts = opts || {};
	this.children = [];

	this.opts.reverse_merge({
		only: ["index", "new", "create", "show", "edit", "update", "destroy"],
		except: []
	});

	this.opts.only = Array.wrap(this.opts.only);
	this.opts.except = Array.wrap(this.opts.except);

	if (subResources) {
		subResources.call(this);
	}
}

Resource.prototype.getRoot = function() {
	if (this.opts.root) {
		return this.makeRoute(this.opts.root);
	}

	return null;
};

Resource.prototype.resource = function(a, b, c) {
	this.children.push(new Resource(a, b, c));
};

Resource.prototype.actions = function() {
	return this.opts.only.minus(this.opts.except);
};

Resource.prototype.makeRoute = function(action) {
	return new Route(this, action, [new Path(this.name)].concat(ROUTE_TYPES[action] || new Path(action)), this.opts.root === action);
};

Resource.prototype.makeRoutes = function() {
	var actions = this.actions(),
		routes = [];

	for (var i = 0; i < actions.length; i++) {
		routes.push(this.makeRoute(actions[i]));
	}

	return routes;
};

module.exports = Resource;
