var SidebarView = Backbone.View.extend({
	el: $('.sidebar'),
	sidebarTpl: _.template($('#sidebar').html()),

	initialize: function () {
		this.router = new Router();
		this.render();
	},

	render: function () {
		this.$el.html(this.sidebarTpl());
		return this;
	},

	events: {
		'click .sidebar-nav__link--event': 'routeEvent',
		'click .sidebar-nav__link--groups': 'routeGroups',
		'click .sidebar-nav__link--attendees': 'routeAttendees',
		'click .sidebar-nav__link--organizers': 'routeOrganizers',

		'click .sidebar-header__nav-button': 'showMenu',
		'click .sidebar-panel-top__icon-back': 'hideMenu'
	},

	routeEvent: function(event) {
		// event.preventDefault();
		$(".over").removeClass("overlay");
		// $(".sidebar-panel").addClass("sidebar-panel--hidden");
		// this.router.navigate('event', {trigger: true});
	},

	routeGroups: function(event) {
		// event.preventDefault();
		$(".over").removeClass("overlay");
		// $(".sidebar-panel").addClass("sidebar-panel--hidden");
		// this.router.navigate('groups', {trigger: true});
	},

	routeAttendees: function(event) {
		// event.preventDefault();
		$(".over").removeClass("overlay");
		// $(".sidebar-panel").addClass("sidebar-panel--hidden");
		// this.router.navigate('attendees', {trigger: true});
	},

	routeOrganizers: function(event) {
		// event.preventDefault();
		$(".over").removeClass("overlay");
		// $(".sidebar-panel").addClass("sidebar-panel--hidden");
		// this.router.navigate('organizers', {trigger: true});
	},

	showMenu: function() {
		$(".sidebar-panel").removeClass("sidebar-panel--hidden");
		$(".over").addClass("overlay");
	},

	hideMenu: function() {
		$(".over").removeClass("overlay");
		$(".sidebar-panel").addClass("sidebar-panel--hidden");
	}
});