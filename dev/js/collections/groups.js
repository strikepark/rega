var Groups = Backbone.Collection.extend({
    model: Group,
    url: 'http://miet.im/api/groups/?format=json&limit=1000/',

    parse: function (response) {
        return response.results;
    },

    comparator: function (item) {
        return [item.get('name')];
    },

    search: function (letters) {
        var pattern = new RegExp(letters,'gi');
        return (this.filter(function (item) {
            return pattern.test(item.get('name'));
        }));
    }
});