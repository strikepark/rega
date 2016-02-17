var Event = Backbone.Model.extend({
    urlRoot: 'http://miet.im/api/event/',

    defaults: {
        'name': '',
        'description': '',
        'location': '',
        'maxTeamSize': null,
        'startDate': null,
        'endDate': null
    },

    validate: function (attrs) {
        var errors = [];
        if (attrs.maxTeamSize !== '' && attrs.maxTeamSize !== null) {
            if (!this.validateMaxTeamSize(attrs.maxTeamSize)) {
                errors.push({
                    name: 'maxTeamSize',
                    message: 'Максимальный размер команды должен быть целым числом.'
                });
            }
        }
        if (attrs.startDate !== '' && attrs.startDate !== null) {
            if (!this.validateDate(attrs.startDate)) {
                errors.push({
                    name: 'startDate',
                    message: 'Дата должна быть в формате ISO8601, например 2015-08-18 18:36, для упрощения ввода воспользуйтесь всплывающим календарем.'
                });
            }
        }
        if (attrs.endDate !== '' && attrs.endDate !== null) {
            if (!this.validateDate(attrs.endDate)) {
                errors.push({
                    name: 'endDate',
                    message: 'Дата должна быть в формате ISO8601, например 2015-08-18 18:36, для упрощения ввода воспользуйтесь всплывающим календарем.'
                });
            }
        }
        return errors.length > 0 ? errors : false;
    },

    validateMaxTeamSize: function (maxTeamSize) {
        return (Number(maxTeamSize) ^ 0) === Number(maxTeamSize);
    },

    validateDate: function (date) {
        var regExp = /^\d\d\d\d-\d\d-\d\d\T\d\d:\d\d:\d\d\Z$/;
        return regExp.test(date);
    }
});