var User = Backbone.Model.extend({
    urlRoot: 'http://miet.im/api/users/',

    defaults: {
        'username': 'unknown',
        'email': 'unknown@ya.ru',

        'firstName': 'Unknown',
        'lastName': 'Unknown',
        'middleName': 'Unknown',

        'telephone': 'unknown',

        'status': {'status': 0},
        'team': 'unknown',
        // 'team': null,

        'isStaff': false
    },

    validate: function (attrs) {
        var errors = [];
        // if (attrs.username !== '' || attrs.username !== 'unknown') {
        //     if (!this.validateUsername(attrs.username)) {
        //         errors.push({
        //             name: 'username',
        //             message: 'Сверьте логин с номером студентческого билета. Пример — u123456.'
        //         });
        //     }
        // }
        // if (attrs.email !== '' || attrs.email !== null) {
        //     if (!this.validateEmail(attrs.email)) {
        //         errors.push({
        //             name: 'email',
        //             message: 'Эл. почта должна состоять из @ и домена, например example@ya.ru.'
        //         });
        //     }
        // }
        // if (attrs.telephone !== '' || attrs.telephone !== '+7 ' || attrs.telephone !== null) {
        //     if (!this.validateTelephone(attrs.telephone)) {
        //         errors.push({
        //             name: 'telephone',
        //             message: 'Номер телефона должен состоять из 11 цифр и включать код города или страны, например +7 967 050-98-06.'
        //         });
        //     }
        // }
        return errors.length > 0 ? errors : false;
    },

    validateUsername: function (username) {
        var regExp = /^(u|t|8)[0-9]{6}|unknown$/;
        return regExp.test(username);
    },

    validateEmail: function (email) {
        var regExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        return regExp.test(email);
    },

    validateTelephone: function (telephone) {
        var regExp = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/;
        return regExp.test(telephone);
    }
});