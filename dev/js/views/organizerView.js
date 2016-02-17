var OrganizerView = Backbone.View.extend({
	tagName: "article",
	className: "o-row",
	// Шаблоны
	organizerTemplate: _.template($('#organizer_single').html()),

	// Рендер шаблонов
	render: function () {
		$(this.el).html(this.organizerTemplate(this.model.toJSON()));
		return this;
	},

	renderOrganizer: function (item) {
		var organizerView = new OrganizerView({
			model: item
		});
		$(this.el).append(organizerView.render().el);
	},

	// События
	events: {
		'click .o-row-cell-delete__link': 'deleteOrganizer',
		'click .o-row-cell-name__link': 'routeToEdit'
	},

	deleteOrganizer: function (event) {
		event.preventDefault();
		var confirmRemove = confirm('Вы уверены, что хотите удалить организатора?');
		if (confirmRemove) {
			this.remove();
			this.model.destroy();
		}
	},

	routeToEdit: function (event) {
		event.preventDefault();
		var router = new Router();
		router.navigate('users/edit/' + this.model.get('id'), {trigger: true});
	}
});