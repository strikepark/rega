//= libs/jquery.js
//= libs/underscore.js
//= libs/backbone.js

//= libs/datetimepicker.js
//= libs/chosen.js
//= libs/base64_encode.js

// var _sync = Backbone.sync;
// Backbone.sync = function(method, model, options) {
// 	if(model && (method === 'delete' || method === 'read' || method === 'create' || method === 'update' || method === 'patch' || method === 'put')) {
// 		options.contentType = 'application/json';
// 		options.data = JSON.stringify(options.attrs || model.toJSON());
// 	}

// 	var cook = document.cookie;
// 	options.headers = {
// 		'Cookie': cook
// 	};

// 	return _sync.call(	this, method, model, options);
// }

var _sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
	if(model && (method === 'GET' || method === 'get' || method === 'delete' || method === 'read' || method === 'create' || method === 'update' || method === 'patch' || method === 'put')) {
		options.contentType = 'application/json';
		options.data = JSON.stringify(options.attrs || model.toJSON());
	}

    var beforeSend = options.beforeSend;
    // var cook = document.cookie + 'hello';
    // var basic = 'Basic ' + base64_encode('strikepark' + ':' + 'fdssd');
    options.beforeSend = function(xhr) {
        xhr.setRequestHeader('Cookie', document.cookie);
        // xhr.setRequestHeader('Authorization', basic);
        if (beforeSend) return beforeSend.apply(this, arguments);
	};

	// console.log(base64_encode('strikepark' + ':' + '1234'));

	options.headers = {
		'Сookie': document.cookie,
		// "Authorization": "Basic " + btoa('strikepark' + ":" + '1234')
	};

	options.Cookie = document.cookie;

	console.log(options);
	return _sync.call(this, method, model, options);
};

//= models/event.js
//= models/group.js
//= models/user.js

//= collections/attendees.js
//= collections/groups.js
//= collections/organizers.js
//= collections/users.js

//= views/sidebarView.js

//= views/loginView.js

//= views/eventView.js

//= views/userEditView.js
//= views/userNewView.js

//= views/organizerView.js
//= views/organizersView.js

//= views/attendeeView.js
//= views/attendeesView.js

//= views/groupView.js
//= views/groupsView.js

//= views/groupNewView.js
//= views/groupEditView.js

//= router.js

var app = {
    initialize: function () {
        this.router = new Router();
        // Backbone.history.start({pushState: true});
        Backbone.history.start();
    }
};

$(document).ready(function() {
    app.initialize();
});