var GroupEditView = Backbone.View.extend({
    el: $('.content'),
    groupEditTpl: _.template($('#group_edit').html()),

    initialize: function () {
        $('.content').empty();
        this.render();

        this.fetchCollectionForSingle();
        this.fetchCollectionForMultiply();
    },

    events: {
        'click .fp__close': 'routeToUsers',
        'click .fp-field__button': 'addGroup',
        'click .fp-alert__close': 'hintErrorTop'
    },

    render: function () {
        this.$el.append(this.groupEditTpl(this.model.toJSON()));
        return this;
    },

    fetchCollectionForSingle:  function () {
        this.collection = new Users();
        this.collection.fetch({
            success: function (collection, response, options) { createSelect(collection) },
            error: function (collection, response, options) { console.log(response); }
        });

        var model = this.model;

        function createSelect(collection) {
            var firstName = collection.pluck('firstName'),
                lastName = collection.pluck('lastName'),
                urlValue = collection.pluck('url'),
                curatorThis = model.get('curator');

            if (curatorThis !== null) {
                var firstNameThis = curatorThis.firstName,
                        lastNameThis = curatorThis.lastName,
                        urlValueThis = curatorThis.url,
                        fullNameThis = firstNameThis + ' ' + lastNameThis;
            } else {
                var urlValueThis = false;
            }


            var array = [];
            for ( var i = 0; i < firstName.length; i++) {
                var obj = {
                    url: urlValue[i],
                    name: firstName[i] + ' ' + lastName[i]
                }
                array.push(obj);
            };

            if (urlValueThis) {
                var select = $('<select/>', {
                    html: '<option value=' + urlValueThis + '>' + fullNameThis + '</option>'
                });
            } else {
                var select = $('<select/>', {
                    html: '<option value=""></option>'
                });
            }
            _.each(array, function (item) {
                if ( urlValueThis ) {
                    if ( item.url !== urlValueThis ) {
                        var option = $('<option/>', {
                            value: item.url,
                            text: item.name
                        }).appendTo(select);
                    }
                } else {
                    var option = $('<option/>', {
                        value: item.url,
                        text: item.name
                    }).appendTo(select);
                }
            });


            select.addClass("fp-field__select fp-field__select--standart");
            select.attr("data-placeholder", "Выберите куратора");
            $('.fp-field-curator').find('.fp-field__error').before(select);

            $(".fp-field__select--standart").chosen({
                no_results_text: "Нет результатов по запросу",
                width: "100%",
                allow_single_deselect: true
            });
        }
    },

    fetchCollectionForMultiply:  function () {
        this.collection = new Users();
        this.collection.fetch({
            success: function (collection, response, options) { createSelect(collection) },
            error: function (collection, response, options) { console.log(response); }
        });

        var model = this.model;

        function createSelect(collection) {
            var firstName = collection.pluck('firstName'),
                    lastName = collection.pluck('lastName'),
                    urlValue = collection.pluck('url'),
                    membersThis = model.get('members');

            if ( membersThis === null ) {
                var select = $('<select/>', {
                    html: '<option value=""></option>'
                });
                select.attr("data-placeholder", "Выберите куратора");
                select.addClass("fp-field__select fp-field__select--multiple");
                select.prop("multiple", true);
            } else if ( membersThis !== null ) {
                var select = $('<select/>');
                select.attr("data-placeholder", "Выберите куратора");
                select.addClass("fp-field__select fp-field__select--multiple");
                select.prop("multiple", true);
                for (var i = 0; i < membersThis.length; i++) {
                    var option = $('<option/>', {
                        value: membersThis[i].url,
                        text: membersThis[i].firstName + ' ' + membersThis[i].lastName
                    });
                    option.prop("selected", true);
                    option.appendTo(select);
                }
            }

            var array = [];
            for ( var i = 0; i < firstName.length; i++) {
                var obj = {
                    url: urlValue[i],
                    name: firstName[i] + ' ' + lastName[i]
                }
                array.push(obj);
            };

            var arrayUrlsThis = [];
            for (var i = 0; i < membersThis.length; i++) {
                var urlFor = membersThis[i].url;
                arrayUrlsThis.push(urlFor);
            }

            function matchingUsers(url) {
                for (var i = 0; i < arrayUrlsThis.length; i++) {
                    if (arrayUrlsThis[i] === url) {
                        return true;
                    }
                }
            }

            if (membersThis === null) {
                _.each(array, function (item) {
                    var option = $('<option/>', {
                        value: item.url,
                        text: item.name
                    });
                    option.prop("selected", false);
                    option.appendTo(select);
                });
            } else if ( membersThis !== null ) {
                for (var i = 0; i < array.length; i++) {
                    if ( !(matchingUsers(array[i].url)) ) {
                        var option = $('<option/>', {
                            value: array[i].url,
                            text: array[i].name
                        });
                        option.prop("selected", false);
                        option.appendTo(select);
                    }
                }
            }

            select.addClass("fp-field__select fp-field__select--standart");
            select.attr("data-placeholder", "Выберите куратора");
            $('.fp-field-members').find('.fp-field__error').before(select);

            // var eventModel = new Event();
            // eventModel.fetch();
            // var maxTeamSize = eventModel.get('maxTeamSize');
            // if ( typeof maxTeamSize === "string" ) { maxTeamSize = parseInt(maxTeamSize); }
            var maxTeamSize = 4;

            $(".fp-field__select--multiple").chosen({
                no_results_text: "Нет результатов по запросу",
                width: "100%",
                max_selected_options: maxTeamSize + 1
            });
        }
    },

    saveEditGroup: function (event) {
        event.preventDefault();

        $('.eg-field__button').html('<img src="../i/spin_group_add.gif">');

        $('#name').prop('disabled', true);
        $('#description').prop('disabled', true);
        $('.eg-field__button').prop('disabled', true);

        var array = [];
        $('.eg-field-members').find('select option:selected').each(function(){
            var obj = {
                url: this.value,
                firstName: (this.text).split(' ')[0],
                lastName: (this.text).split(' ')[1]
            }
            array.push(obj);
        });
        // Удаляю первый пустой элемент

        var formData = {
            name: $('#name').val(),
            description: $('#description').val(),
            curator: {
                url: $('.eg-field-curator').find('select option:selected').val(),
                firstName: $('.eg-field-curator').find('select option:selected').text().split(' ')[0],
                lastName: $('.eg-field-curator').find('select option:selected').text().split(' ')[1]
            },
            members: array
        };

        console.log(formData.name);
        console.log(formData.description);
        console.log(formData.curator);
        console.log(formData.members);


        this.model.set(formData);
        this.model.save(formData, {
            success: function(model, response) {
                $('#name').prop('disabled', false);
                $('#description').prop('disabled', false);
                $('.eg-field__button').prop('disabled', false);
                $('.eg-field__button').html('Создать группу');
                $('.eg-field__error--top').closest("div").addClass('eg-field--error');
                $('.eg-field__error--top').addClass(' eg-field__error--top--good');
                $('.eg-field__error--top').html('Группа успешно создана. <a href="" class="eg-field__error--link">Перейти к списку групп</a><i class="eg-field__error--close"></i>');
            },
            error: function(model, response) {
                $('#name').prop('disabled', false);
                $('#description').prop('disabled', false);
                $('.eg-field__button').prop('disabled', false);
                $('.eg-field__button').html('Создать группу');
                $('.eg-field__error--top').closest("div").addClass('eg-field--error');
                $('.eg-field__error--top').addClass('eg-field__error--top--bad');
                $('.eg-field__error--top').html('Произошла ошибка соединения с сервером. Побробуйте создать группу чуть позже<i class="eg-field__error--close"></i>');
            },
            wait: true
        });
        $('.a-row--info').empty();
    }
});