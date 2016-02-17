var OrganizersView = Backbone.View.extend({
	el: $('.content'),
	contentTopTpl: _.template($('#organizer_top').html()),

	initialize: function () {
		this.collection = new Organizers();

		this.renderTop();
		this.$el.append('<div class="o-row--header-box"><div class="o-row--header"><span class="o-row-cell-name">Имя</span><span class="o-row-cell-telephone">Телефон</span><span class="o-row-cell-delete"></span></div></div><div class="o-row--info"></div>');

		this.collection.bind('request', this.ajaxStart, this);
		this.collection.bind('sync', this.ajaxComplete, this);

		this.collection.fetch({reset: true});

		this.listenTo( this.collection, 'reset', this.render );
		this.listenTo( this.collection, 'add', this.renderOrganizer );
		this.listenTo( this.collection, 'remove', this.deleteOrganizer );
		// this.collection.on('change:model', this.newData, this);
	},

	renderTop: function () {
		this.$el.prepend(this.contentTopTpl());
		return this;
	},

	render: function () {
		this.$el.find('article').remove();
		_.each(this.collection.models, function (item) {
			this.renderOrganizer(item);
		}, this);
	},

	renderOrganizer: function (item) {
		var organizerView = new OrganizerView({
			model: item
		});
		this.$el.append(organizerView.render().el);
	},

	events: {
		"keyup .search__input": "search",
		"focus .search__input": "showClearButton",
		"focusout .search__input": "closeClearButton",
		"click .search__clear": "clearResult",

		'click .ot__add-user-btn': 'routeToAddUser',
		'click .ot__refresh-table-btn': 'refreshCollection'
	},

	ajaxStart: function () {
		$('.o-row--info').html('<div class="o-row--loading-info"><div class="loading"></div></div>');
	},

	ajaxComplete: function () {
		$('.o-row--info').empty();
		this.render();
	},

	search: function () {
		var searchTerm = $.trim(this.$('.search__input').val());
		if(searchTerm) {
			var filterd = this.collection.search(searchTerm);
			if(filterd.length) {
				this.$el.find("article").remove();
				$('.o-row--info').empty();
				_.each(filterd, this.renderOrganizer, this);
			} else {
				this.$el.find("article").remove();
				$('.o-row--info').empty();
				$('.o-row--info').html('<div class="o-row--search-info"><div class="search__empty"></div></div>');
			}
		} else {
			$('.o-row--info').empty();
			this.render();
		}
	},

	showClearButton: function () {
		if ( $(".search__input").val() === "" ) {
			$('.search__clear').toggleClass("display-none");
		}
	},

	closeClearButton: function () {
		if ( $(".search__input").val() === "" ) {
			$('.search__clear').toggleClass("display-none");
		}
	},

	clearResult: function () {
		$('.o-row--info').empty();
		this.render();
		$('.search__clear').toggleClass("display-none");
	},

	routeToAddUser: function (event) {
		event.preventDefault();
		var router = new Router();
		router.navigate('users/new', {trigger: true});
	},

	refreshCollection: function (event) {
		this.collection.fetch({reset: true});
	},
});