var GroupsView = Backbone.View.extend({
    el: $('.content'),
    groupTopTpl: _.template($('#group_top').html()),

    initialize: function () {
        this.collection = new Groups();

        this.renderTop();
        this.$el.append('<div class=\'groups-page\'></div>');

        this.collection.bind('request', this.ajaxStart, this);
        this.collection.bind('sync', this.ajaxComplete, this);

        this.collection.fetch({reset: true});

        this.listenTo( this.collection, 'reset', this.render );
        this.listenTo( this.collection, 'add', this.renderGroup );
        this.listenTo( this.collection, 'remove', this.deleteGroup );
    },

    render: function () {
        $('.groups-page').find('article').remove();
        _.each(this.collection.models, function (item) {
            this.renderGroup(item);
        }, this);
    },

    renderGroup: function (item) {
        var groupView = new GroupView({
            model: item
        });
        $('.groups-page').append(groupView.render().el);
    },

    renderTop: function () {
        this.$el.html(this.groupTopTpl());
        return this;
    },

    events: {
        "click .gt__refresh-table-btn": "refreshCollection",
        "click .gt__add-group-btn": "routeToAddUser",

        "keyup .search__input": "search",
        "focus .search__input": "showClearButton",
        "focusout .search__input": "closeClearButton",
        "click .search__clear": "clearResult",
    },

    ajaxStart: function () {
        $('.gp-info').html('<div class="gp-info--loading-info"><div class="loading"></div></div>');
    },

    ajaxComplete: function () {
        $('.gp-info').empty();
        this.render();
    },

    search: function() {
        var searchTerm = $.trim(this.$('.search__input').val());
        if(searchTerm) {
            var filterd = this.collection.search(searchTerm);
            if(filterd.length) {
                $(this.el).find("article").remove();
                $('.gp-info').empty();
                _.each(filterd, this.renderGroup, this);
            } else {
                $(this.el).find("article").remove();
                $('.gp-info').html('<div class="gp-info--search-info"><div class="search__empty">Ничего не найдено</div></div>');
            }
        } else {
            $('.gp-info').empty();
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
        $('.gp-info').empty();
        this.render();
        $('.search__clear').toggleClass("display-none");
    },

    routeToAddUser: function (event) {
        event.preventDefault();
        var router = new Router();
        router.navigate('groups/new', {trigger: true});
    },

    refreshCollection: function (event) {
        this.collection.fetch({reset: true});
    }
});