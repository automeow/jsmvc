var Base = require("./base.js");

function NotFound() {
	Base.apply(this, arguments);
	this.code = 404;
}
NotFound.prototype = Object.create(Base.prototype);
NotFound.prototype.constructor = NotFound;
Object.assign(NotFound, Base);

module.exports = NotFound;
