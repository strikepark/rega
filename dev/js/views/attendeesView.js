var AttendeesView = Backbone.View.extend({
	el: $('.content'),
	contentTopTpl: _.template($('#attendee_top').html()),

	initialize: function () {
		this.collection = new Attendees();

		this.renderTop();
		this.$el.append('<div class="a-row--header-box"><div class="a-row--header"><span class="a-row-cell-name">Имя</span><span class="a-row-cell-group">Группа</span><span class="a-row-cell-status">Статус</span><span class="a-row-cell-delete"></span></div></div><div class="a-row--info"></div>');

		this.collection.bind('request', this.ajaxStart, this);
		this.collection.bind('sync', this.ajaxComplete, this);

		this.collection.fetch({reset: true});

		this.listenTo( this.collection, 'reset', this.render );
		this.listenTo( this.collection, 'add', this.renderAttendee );
		this.listenTo( this.collection, 'remove', this.deleteAttendee );
	},

	render: function () {
		this.$el.find('article').remove();
		_.each(this.collection.models, function (item) {
			this.renderAttendee(item);
		}, this);
	},

	renderAttendee: function (item) {
		var attendeeView = new AttendeeView({
			model: item
		});
		this.$el.append(attendeeView.render().el);
	},

	renderTop: function () {
		this.$el.html(this.contentTopTpl());
		return this;
	},

	events: {
		"keyup .search__input": "search",
		"focus .search__input": "showClearButton",
		"focusout .search__input": "closeClearButton",
		"click .search__clear": "clearResult",

		'click .at__add-user-btn': 'routeToAddUser',
		'click .at__refresh-table-btn': 'refreshCollection'
	},

	ajaxStart: function () {
		$('.a-row--info').html('<div class="a-row--loading-info"><div class="loading"></div></div>');
	},

	ajaxComplete: function () {
		$('.a-row--info').empty();
	},

	search: function() {
		var searchTerm = $.trim(this.$('.search__input').val());
		if(searchTerm) {
			var filterd = this.collection.search(searchTerm);
			if(filterd.length) {
				$(this.el).find("article").remove();
				$('.a-row--info').empty();
				_.each(filterd, this.renderAttendee, this);
			} else {
				$(this.el).find("article").remove();
				$('.a-row--info').html('<div class="a-row--search-info"><div class="search__empty">Ничего не найдено</div></div>');
			}
		} else {
			$('.a-row--info').empty();
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
		$('.a-row--info').empty();
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
	}
});