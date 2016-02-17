var Group = Backbone.Model.extend({
    urlRoot: 'http://miet.im/api/groups/',

    defaults: {
        'name': 'unknown',
        'description': 'unknown',
        'curator': null,
        'members': null
    }
});