var GroupView = Backbone.View.extend({
    tagName: "article",
    className: "gp-card clearfix",
    groupTpl: _.template($('#group_single').html()),

    initialize: function () {},

    render: function () {
        $(this.el).html(this.groupTpl(this.model.toJSON()));
        return this;
    },

    events: {
        'click .gp-card-top__delete': 'deleteGroup',
        'click .gp-card-bottom__edit': 'routeToEdit'
    },

    deleteGroup: function (event) {
        event.preventDefault();
        var confirmRemove = confirm('Вы уверены, что хотите удалить участника?');
        if (confirmRemove) {
            this.remove();
            this.model.destroy();
        }
    },

    routeToEdit: function (event) {
        event.preventDefault();
        var router = new Router();
        router.navigate('groups/edit/' + this.model.get('id'), {trigger: true});
    }
});