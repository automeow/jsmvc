function MVCError() {
	Error.apply(this, arguments);
	this.code = 500;
	this.mvc = true;
	this.handled = false;
}
MVCError.prototype = Object.create(MVCError.prototype);
MVCError.prototype.constructor = MVCError;
Object.assign(MVCError, Error);

MVCError.prototype.handle = function() {
	this.handled = true;
};

module.exports = MVCError;
