var Base = require("./base.js");

function DBError() {
	Base.apply(this, arguments);
	this.code = 503;
}
DBError.prototype = Object.create(Base.prototype);
DBError.prototype.constructor = DBError;
Object.assign(DBError, Base);

module.exports = DBError;
