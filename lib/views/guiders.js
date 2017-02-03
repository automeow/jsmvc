module.exports = {
	pageLoaded: function(MVC) {
		var self = this;
		this.MVC = MVC;
		setTimeout(function() {
			self.formSubmission();
		}, 0);
	},

	formSubmission: function() {
		var self = this;

		$("form").submit(function(e) {
			var action = $(this).attr("action");
			e.preventDefault();

			if (action) {
				self.MVC.submitForm(action, self.toJSONString($(this)[0]));
			}
		});
	},

	toJSONString: function(form) {
		var obj = {},
			elements = form.querySelectorAll("input, select, textarea");

		for (var i = 0; i < elements.length; i++) {
			var element = elements[i],
				name = element.name,
				value = element.value;

			if(name) {
				obj[name] = value;
			}
		}

		return obj;
	}
};
