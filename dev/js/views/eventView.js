var EventView = Backbone.View.extend({
    el: $('.content'),
    eventTpl: _.template($('#event').html()),

    initialize: function () {
        this.model = new Event();
        this.render();

        var startDate = this.model.get('startDate');
        var endDate = this.model.get('endDate');

        jQuery('#startDate').datetimepicker({
            lang: 'ru',
            format: 'Y-m-d H:i',
            dayOfWeekStart: 1,
            theme:'dark',
            value: (startDate === null) ? '' : (startDate.substring(0, 10) + ' ' + startDate.substring(11,16))
        });

        jQuery('#endDate').datetimepicker({
            lang: 'ru',
            format: 'Y-m-d H:i',
            dayOfWeekStart: 1,
            theme:'dark',
            value: (startDate === null) ? '' : (endDate.substring(0, 10) + ' ' + endDate.substring(11,16))
        });

        this.listenTo(this.model, 'invalid', function(model, error, options) {
            this.cleanFormErrors();
            _.each(error, this.showFormErrors, this);
        });
    },

    events: {
        'click .ep-field__button': 'saveForm',
        'focus .ep-field__input': 'hintError',
        'click .ep-alert__close': 'hintErrorTop'
    },

    render: function () {
        $(this.el).html(this.eventTpl(this.model.toJSON()));
        return this;
    },

    disabledInput: function (prop) {
        
    },

    saveForm: function (event) {
        event.preventDefault();
        $('.ep-field__input').prop('disabled', true);
        $('.ep-field__textarea').prop('disabled', true);
        $('.ep-field__button').prop('disabled', true);
        $('.ep-field__button').html('<img src="../i/spin_small.gif">');
        var startDate = $('#startDate').val().split(' ');
        var endDate = $('#endDate').val().split(' ');

        var formData = {
            name: $('#name').val(),
            location: $('#location').val(),
            description: $('#description').val(),
            maxTeamSize: $('#maxTeamSize').val(),
            startDate: ($('#startDate').val() === '') ? null : startDate[0] + 'T' + startDate[1] + ':00Z',
            endDate: ($('#startDate').val() === '') ? null : endDate[0] + 'T' + endDate[1] + ':00Z'
        };

        var error = this.model.validate(formData);
        if(error) {
            $('.ep-field__input').prop('disabled', false);
            $('.ep-field__textarea').prop('disabled', false);
            $('.ep-field__button').prop('disabled', false);
            $('.ep-field__button').html('Сохранить');
            this.cleanFormErrors();
            _.each(error, this.showFormErrors, this);
            return;
        } else {
            this.cleanFormErrors();
            this.model.save(formData, {
                success: function(model, response) {
                    $('.ep-field__input').prop('disabled', false);
                    $('.ep-field__textarea').prop('disabled', false);
                    $('.ep-field__button').prop('disabled', false);
                    $('.ep-field__button').html('Сохранить');
                    $('.content').prepend('<div class=\'ep-alert ep-alert--success\'><div class=\'ep-alert__text\'>Данные сохранены</div><div class=\'ep-alert__close\'></div>');
                    window.scrollTo(0,0);
                    $('.ep-alert').slideDown(500);
                },
                error: function(model, response) {
                    $('.ep-field__input').prop('disabled', false);
                    $('.ep-field__textarea').prop('disabled', false);
                    $('.ep-field__button').prop('disabled', false);
                    $('.ep-field__button').html('Сохранить');
                    $('.content').prepend('<div class=\'ep-alert ep-alert--error\'><div class=\'ep-alert__text\'>Произошла ошибка. Попробуйте сохранить данные позже.</div><div class=\'ep-alert__close\'></div>');
                    window.scrollTo(0,0);
                    $('.ep-alert').slideDown(500);
                },
                wait: true
            });
        }
    },

    cleanFormErrors: function () {
        this.$('.ep-field').removeClass('ep-field--error');
        this.$('.ep-field__error').empty();
    },

    showFormErrors: function (error) {
        this.$('.ep-field-' + error.name).addClass('ep-field--error').find('.ep-field__error').html(error.message);
    },

    hintError: function (event) {
        $(event.currentTarget).closest("div").removeClass("ep-field--error");
    },

    hintErrorTop: function (event) {
        event.preventDefault();
        $('.ep-alert').slideUp(300);
        $('.ep__close').show()
    }
});