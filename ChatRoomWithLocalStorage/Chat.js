// Object Class from the lecture (demo) - Classical OOP
var Class = (function () {
    function createClass(properties) {
        var f = function () {
            //This is an addition to enable super (base) class with inheritance
            if (this._superConstructor) {
                this._super = new this._superConstructor(arguments);
            }
            this.init.apply(this, arguments);
        }
        for (var prop in properties) {
            f.prototype[prop] = properties[prop];
        }
        if (!f.prototype.init) {
            f.prototype.init = function () { }
        }
        return f;
    }

    Function.prototype.inherit = function (parent) {
        var oldPrototype = this.prototype;
        this.prototype = new parent();
        this.prototype._superConstructor = parent;
        for (var prop in oldPrototype) {
            this.prototype[prop] = oldPrototype[prop];
        }
    }

    return {
        create: createClass,
    };
}());

// Shims for Storage - setObject and getObject
(function () {
    if (!Storage.prototype.setObject) {
        Storage.prototype.setObject = function setObject(key, obj) {
            var jsonObj = JSON.stringify(obj);
            this.setItem(key, jsonObj);
        };

    }
    if (!Storage.prototype.getObject) {
        Storage.prototype.getObject = function getObject(key) {
            var jsonObj = this.getItem(key);
            var obj = JSON.parse(jsonObj);
            return obj;
        };
    }
})();

// Escape the input from the user
escapeText = function (text) {
    var escapedStr = String(text).replace(/&/g, '&amp;');
    escapedStr = escapedStr.replace(/</g, '&lt;');
    escapedStr = escapedStr.replace(/>/g, '&gt;');
    escapedStr = escapedStr.replace(/"/g, '&quot;');
    escapedStr = escapedStr.replace(/'/g, '&#39');
    return escapedStr;
};

// Ask the user for nickname and create new object User
function getUser() {
	var name = prompt('Enter your chat name:', 'Guest');
	if (!name || name === ' ') {
		name = 'Guest';
	}

	name = escapeText(name);
	return new User(name);
}

// Object User - to passed it as input parameter of init function of ChatRoom
var User = Class.create({
	init: function () {
		this.name = arguments[0];
	}
});

// Object Post with properties text, user and 
// method load() save the post in local Storage and
// render() create DOM element div from a post and append it to the chat
var Post = Class.create({
    init: function () {
        this.text = arguments[0];
        this.user = arguments[1];
    },
    load: function () {
        var now = new Date();
        localStorage.setObject(now, this);
    },
    render: function () {
        var dateTime = arguments[0];
        var selector = arguments[1];
        var element = $('<div></div>');
        var date = $('<em></em>').append(dateTime.substr(0, 25));
        element.append(date);
        var userName = $('<strong></strong>').append(this.user.name);
        element.append(userName);
        var message = $('<p></p>').append(this.text);
        element.append(message);
        $(selector).append(element);
		return element;
    }
});

// Object ChatRoom with input parameters info, user
var ChatRoom = Class.create({
    init: function () {
        var info = arguments[0];
        var user = arguments[1];

        // Create div chat with id chat-room
        var chat = $('<div id="chat-room"></div>');

        // Append chat info and close button (id - close) and add events openChatRoom and closeChatRoom to them
        var menu = $('<div></div>');
        var span = $('<span>' + info + '</span>');
        span.on('click', openChatRoom);
        menu.append(span);
        var close = $('<button id="close">X</button>');
        close.on('click', closeChatRoom);
        menu.append(close);
        chat.append(menu);

        // Create div chat box with id chat-box
        var chatBox = $('<div id="chat"><div id="chat-box"></div></div>');

        // Create input for the message (id - message) and send button (id - send) and add event sendPost
        var messageText = $('<input type="text" id="message" />');
        chatBox.append(messageText);
        var send = $('<button id="send">Send</button>');
        send.on('click', sendPost);
        chatBox.append(send);
        chat.append(chatBox);

        // Append chat to document.body
        $('body').append(chat);

        // Define the event function when chat info is clicked (show chat box)
        function openChatRoom() {
            $('#chat').css('display', '');
        }

        // Define the event function when close button is clicked (hide chat box)
        function closeChatRoom() {
            $('#chat').css('display', 'none');
        }

        // Define the event function when send button is clicked (create new Post and save it)
        function sendPost() {
            var message = escapeText($('#message').val());
            $('#message').val('');
            var post = new Post(message, user);
            post.load();
        }

        // Update messages in the chat box from localStorage by sorting them chronologically
        var interval = setInterval(function () {
            var dates = [];
            for (var count = 0; count < localStorage.length; count++) {
                var key = localStorage.key(count);
                var keyDate = new Date(key);
                dates.push(keyDate);
            }

            dates.sort();
            $('#chat-box').html('');
            for (var count = 0; count < dates.length; count++) {
                var currentDate = dates[count].toString();
                var currentPost = localStorage.getObject(currentDate);
                var post = new Post(currentPost.text, currentPost.user);
                post.render(currentDate, '#chat-box');
            }

            $('#chat-box')[0].scrollTop = $('#chat-box')[0].scrollHeight;
        }, 5000);
    }
});

// Example
var user = getUser();
var chatRoom = new ChatRoom('JustTalk', user);