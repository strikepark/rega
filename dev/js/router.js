var Router = Backbone.Router.extend({
    routes: {
        'login(/)': 'login',

        'event(/)': 'event',
        '(/)': 'event',

        'users/new(/)': 'userNew',
        'users/edit/:id(/)': 'userEdit',

        'users/organizers(/)': 'organizers',
        'organizers(/)': 'organizers',

        'users/attendees(/)': 'attendees',
        'attendees(/)': 'attendees',

        'groups/new(/)': 'groupNew',
        'groups/edit/:id(/)': 'groupEdit',

        'groups(/)': 'groups'
    },

    login: function () {
        $('.sidebar').empty();
        $('.content').empty();

        var loginView = new LoginView();
    },

    event: function () {
        $('.sidebar').empty();
        $('.content').empty();

        var eventView = new EventView();
        var sidebarView = new SidebarView();
    },

    userNew: function () {
        $('.sidebar').empty();
        $('.content').empty();

        var userNew = new UserNewView();
        var sidebarView = new SidebarView();
    },

    userEdit: function (id) {
        $('.sidebar').empty();
        $('.content').empty();

        var sidebarView = new SidebarView();
        $('.content').html('<div class=\'fp-load\'><div class=\'fp-load__spin\'></div></div>')

        var usersCollection = new Users();
        usersCollection.fetch({
            success: function (collection, response, options) {
                var user = collection.get(id);

                var userEdit = new UserEditView({
                    model: user
                });
            },
            error: function (collection, response, options) {
                console.log('error');
            }
        });
    },

    organizers: function () {
        $('.sidebar').empty();
        $('.content').empty();

        var sidebarView = new SidebarView();
        var organizersView = new OrganizersView();
    },

    attendees: function () {
        $('.sidebar').empty();
        $('.content').empty();

        var sidebarView = new SidebarView();
        var attendeesView = new AttendeesView();
    },

    groups: function () {
        $('.sidebar').empty();
        $('.content').empty();

        var sidebarView = new SidebarView();
        var groupsView = new GroupsView();
    },

    groupEdit: function (id) {
        $('.sidebar').empty();
        $('.content').empty();

        var sidebarView = new SidebarView();
        $('.content').html('<div class=\'fp-load\'><div class=\'fp-load__spin\'></div></div>')

        var groupsCollection = new Groups();
        groupsCollection.fetch({
            success: function (collection, response, options) {
                var group = collection.get(id);

                var groupEdit = new GroupEditView({
                    model: group
                });
            },
            error: function (collection, response, options) {
                console.log('error');
            }
        });
    },

    groupNew: function () {
        $('.sidebar').empty();
        $('.content').empty();

        var groupNew = new GroupNewView();
        var sidebarView = new SidebarView();
    },
});