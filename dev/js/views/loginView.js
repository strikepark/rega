var LoginView = Backbone.View.extend({
	el: $('.content'),
	loginTpl: _.template($('#login').html()),

	initialize: function () {
		this.render();
	},

	render: function () {
		this.$el.html(this.loginTpl());
		return this;
	},
});