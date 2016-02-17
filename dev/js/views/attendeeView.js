var AttendeeView = Backbone.View.extend({
    tagName: "article",
    className: "a-row",
    attendeeTpl: _.template($('#attendee_single').html()),

    initialize: function () {},

    render: function () {
        this.$el.html(this.attendeeTpl(this.model.toJSON()));
        return this;
    },

    events: {
        'change .a-row-cell-status__select': 'changeAttendeeStatus',
        'click .a-row-cell-delete__link': 'deleteAttendee',
        'click .a-row-cell-name__link': 'routeToEdit'
    },

    changeAttendeeStatus: function (event) {
        var formData = {
            status: { status: event.currentTarget.value }
        };

        var error = [];
        error = this.model.validate(formData);

        this.model.save(formData, {
            success: function(model, response) {
                console.log(model);
                console.log(response);
            },
            error: function(model, response) {
                console.log(model);
                console.log(response);
            },
            wait: true,
            patch: true
        });
    },

    deleteAttendee: function (event) {
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
        router.navigate('users/edit/' + this.model.get('id'), {trigger: true});
    }
});