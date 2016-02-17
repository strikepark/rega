var UserNewView = Backbone.View.extend({
    el: $('.content'),
    userNewTpl: _.template($('#user_new').html()),

    initialize: function () {
        this.model = new User();
        this.render();

        $('.fp-field-team').append('<div class=\'fp-field__img--select\'></div>');
        this.createSelect();

        this.listenTo(this.model, 'invalid', function(model, error, options) {
            this.cleanFormErrors();
            _.each(error, this.showFormErrors, this);
        });
    },

    events: {
        'click .fp__close': 'routeToUsers',
        'click .fp-field__button': 'addUser',
        'focus .field__input': 'hintError',
        'click .fp-alert__close': 'hintErrorTop'
    },

    render: function () {
        this.$el.append(this.userNewTpl());
        return this;
    },

    createSelect: function () {
        var groupsCollection = new Groups();
        groupsCollection.fetch({
            success: function (collection, response, options) {
                var groupNames = collection.pluck('name'),
                    groupUrls = collection.pluck('url'),
                    array = [],
                    i;

                for (i = collection.length; i--;) {
                    var obj = {
                        url: groupUrls[i],
                        name: groupNames[i]
                    };
                    array.push(obj);
                };

                var select = $('<select/>', { html: '<option value=\'\'></option>' });
                _.each(array, function (item) {
                    var option = $('<option/>', {
                        value: item.url,
                        text: item.name
                    }).appendTo(select);
                });

                select.addClass("fp-field__select fp-field__select--standart")
                      .attr("data-placeholder", "Выберите команду");

                $('.fp-field__img--select').remove();
                $('.fp-field-team').append(select);

                $(".fp-field__select--standart").chosen({
                    no_results_text: "Нет результатов по запросу",
                    width: "100%",
                    allow_single_deselect: true
                });
            },
            error: function (collection, response, options) {
                console.log('error');
            }
        });
    },

    routeToUsers: function (event) {
        event.preventDefault();
        var router = new Router();
        router.navigate("users/attendees", {trigger: true});
    },

    disabledInput: function (prop) {
        $('.fp-field__input').prop('disabled', prop);
        $('.fp-field__radio').prop('disabled', prop);
        $('.fp-field__input--checkbox').prop('disabled', prop);
        $('.fp-field__button').prop('disabled', prop);
        if (prop) {
            $('.chosen-container').hide();
            $('.fp-field-team').append('<div class=\'fp-field__img--select\'></div>');
        } else if(!prop) {
            $('.chosen-container').show();
            $('.fp-field__img--select').remove();
        }
    },

    addUser: function (event) {
        event.preventDefault();
        $('.fp-field__button').html('<img src="../i/spin_small.gif">');
        this.disabledInput(true);

        var group = {
            url: $('.fp-field-team').find('select').val(),
            name: $('.fp-field-team').find('select option:selected').text()
        };

        var formData = {
            username: $('#username').val(),
            email: $('#email').val(),
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            middleName: $('#middleName').val(),
            telephone: $('#telephone').val(),
            team: {'url': group.url},
            status: { status: $('input[name=status]:checked').val() },
            isStaff: $('.fp-field__input--checkbox').prop('checked')
        };

        var error = this.model.validate(formData);
        if(error) {
            $('.fp-field__button').html('Добавить');
            this.disabledInput(false);
            this.cleanFormErrors();
            _.each(error, this.showFormErrors, this);
            return;
        } else {
            this.cleanFormErrors();
            this.model.set(formData);
            this.model.save(formData, {
                success: function(model, response) {
                    // this.disabledInput(false);
                    console.log(model);
                    console.log(response);
                    $('.fp-field__input').prop('disabled', false);
                    $('.fp-field__radio').prop('disabled', false);
                    $('.fp-field__input--checkbox').prop('disabled', false);
                    $('.fp-field__button').prop('disabled', false);
                    $('.chosen-container').show();
                    $('.fp-field__img--select').remove();
                    $('.fp-field__button').html('Добавить');
                    $('.fp__close').hide();
                    window.scrollTo(0,0);
                    $('.content').find('.fp-alert').remove();
                    if (model.get('isStaff')) {
                        $('.content').prepend('<div class=\'fp-alert fp-alert--success\'><div class=\'fp-alert__text\'>Участник успешно создан. Перейти к <a class=\'fp-alert__text__link\' href=\'/#users/edit/' + model.get('id') + '\'>профилю</a> или <a class=\'fp-alert__text__link\' href=\'/#users/organizers\'>списку организаторов.</a></div><div class=\'fp-alert__close\'></div>');
                    } else {
                        $('.content').prepend('<div class=\'fp-alert fp-alert--success\'><div class=\'fp-alert__text\'>Данные участника обновились. Перейти к <a class=\'fp-alert__text__link\' href=\'/#users/edit/' + model.get('id') + '\'>профилю</a> или <a class=\'fp-alert__text__link\' href=\'/#users/attendees\'>списку участников.</a></div><div class=\'fp-alert__close\'></div>');
                    }
                    $('.fp-alert').slideDown(500);
                },
                error: function(model, response) {
                    // this.disabledInput(false);
                    console.log(model);
                    console.log(response);
                    $('.fp-field__input').prop('disabled', false);
                    $('.fp-field__radio').prop('disabled', false);
                    $('.fp-field__input--checkbox').prop('disabled', false);
                    $('.fp-field__button').prop('disabled', false);
                    $('.chosen-container').show();
                    $('.fp-field__img--select').remove();
                    $('.fp-field__button').html('Добавить');
                    $('.fp__close').hide();
                    window.scrollTo(0,0);
                    $('.content').find('.fp-alert').remove();
                    $('.content').prepend('<div class=\'fp-alert fp-alert--error\'><div class=\'fp-alert__text\'>Произошла ошибка, данные дошли до сервера, но не сохранились. Попробуйте добавить пользователя позже.</div><div class=\'fp-alert__close\'></div>');
                    $('.fp-alert').slideDown(500);
                },
                wait: true
            });
        }
    },

    cleanFormErrors: function () {
        this.$('.fp-field').removeClass('fp-field--error');
        this.$('.fp-field__error').empty();
    },

    showFormErrors: function (error) {
        this.$('.fp-field-' + error.name).addClass('fp-field--error').find('.fp-field__error').html(error.message);
    },

    hintError: function (event) {
        $(event.currentTarget).closest("div").removeClass("fp-field--error");
    },

    hintErrorTop: function (event) {
        event.preventDefault();
        $('.fp-alert').slideUp(300);
        $('.fp__close').show()
    }
});