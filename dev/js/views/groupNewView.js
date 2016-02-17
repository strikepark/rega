var GroupNewView = Backbone.View.extend({
    el: $('.content'),
    groupNewTpl: _.template($('#group_new').html()),

    initialize: function () {
        this.model = new Group();
        this.render();

        this.fetchCollection(true);
        this.fetchCollection(false);
    },

    events: {
        "click .fp__close": "routeToGroups",
        "click .fp-field__button": "addGroup",

        'click .fp-alert__close': 'hintErrorTop'
    },

    render: function () {
        this.$el.html(this.groupNewTpl(this.model.toJSON()));
        return this;
    },

    routeToGroups: function (event) {
        event.preventDefault();
        var router = new Router();
        router.navigate("groups/", {trigger: true});
    },

    fetchCollection: function (single) {
        this.collection = new Users();
        this.collection.fetch({
            success: function (collection, response, options) { createSelect(collection, single) },
            error: function (collection, response, options) { console.log(response); }
        });

        function createSelect(collection, single) {
            var firstName = collection.pluck('firstName'),
                lastName = collection.pluck('lastName'),
                urlValue = collection.pluck('url');

            var array = [];
            for (var i = 0; i < firstName.length; i++) {
                var obj = {
                    url: urlValue[i],
                    name: firstName[i] + ' ' + lastName[i]
                }
                array.push(obj);
            };

            var select = $('<select/>', {
                html: '<option value=""></option>'
            });
            _.each(array, function (item) {
                var option = $('<option/>', {
                    value: item.url,
                    text: item.name
                }).appendTo(select);
            });

            // var eventModel = new Event();
            // eventModel.fetch();
            // var maxTeamSize = eventModel.get('maxTeamSize');
            // if ( typeof maxTeamSize === "string" ) { maxTeamSize = parseInt(maxTeamSize); }
            var maxTeamSize = 4;

            if (single) {
                select.addClass("fp-field__select fp-field__select--standart");
                select.attr("data-placeholder", "Выберите куратора");
                $('.fp-field-curator').find('.fp-field__error').before(select);
                $(".fp-field__select--standart").chosen({
                    no_results_text: "Нет результатов по запросу",
                    width: "100%",
                    allow_single_deselect: true
                });
            } else {
                select.attr("data-placeholder", "Выберите участников");
                select.addClass("fp-field__select fp-field__select--multiple");
                select.prop("multiple", true);
                $('.fp-field-members').find('.fp-field__error').before(select);
                $(".fp-field__select--multiple").chosen({
                    no_results_text: "Нет результатов по запросу",
                    width: "100%",
                    allow_single_deselect: true,
                    max_selected_options: maxTeamSize + 1
                });
            }
        }
    },

    addGroup: function (event) {
        event.preventDefault();

        $('.fp-field__button').html('<img src="../i/spin_group_add.gif">');

        $('#name').prop('disabled', true);
        $('#description').prop('disabled', true);
        $('.fp-field__button').prop('disabled', true);

        var array = [];
        $('.fp-field-members').find('select option:selected').each(function(){
            // var obj = {
            //     url: this.value,
            //     firstName: (this.text).split(' ')[0],
            //     lastName: (this.text).split(' ')[1]
            // }
            array.push(this.value);
        });
        // Delete first empty element
        array.splice(0,1);

        var formData = {
            name: $('#name').val(),
            description: $('#description').val(),
            curator: $('.fp-field__select--standart').val(),
            members: array
        };

        console.log(formData.members);

        this.model.save(formData, {
            success: function(model, response) {
                console.log(response);
                $('#name').prop('disabled', false);
                $('#description').prop('disabled', false);
                $('.fp-field__button').prop('disabled', false);
                $('.fp-field__button').html('Создать группу');
                $('.fp-field__error--top').closest("div").addClass('fp-field--error');
                $('.fp-field__error--top').addClass(' fp-field__error--top--good');
                $('.fp-field__error--top').html('Группа успешно создана. <a href="" class="fp-field__error--link">Перейти к списку групп</a><i class="fp-field__error--close"></i>');
            },
            error: function(model, response) {
                console.log(response);
                $('#name').prop('disabled', false);
                $('#description').prop('disabled', false);
                $('.fp-field__button').prop('disabled', false);
                $('.fp-field__button').html('Создать группу');
                $('.fp-field__error--top').closest("div").addClass('fp-field--error');
                $('.fp-field__error--top').addClass('fp-field__error--top--bad');
                $('.fp-field__error--top').html('Произошла ошибка соединения с сервером. Побробуйте создать группу чуть позже<i class="fp-field__error--close"></i>');
            },
            wait: true
        });
    },

    hintErrorTop: function (event) {
        event.preventDefault();
        $('.fp-alert').slideUp(300);
        $('.fp__close').show()
    }
});