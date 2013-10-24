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

// Object Url with properties title, url and method getAnchor which return DOM element a
var Url = Class.create({
    init: function () {
        this.title = arguments[0];
        this.url = arguments[1];
    },
    getAnchor: function () {
        var anchor = document.createElement('a');
        anchor.innerHTML = this.title;
        anchor.href = this.url;
        anchor.target = '_blank';

        return anchor;
    }
});

// Object Folder with properties title, urls and method getFolder which return DOM element ul
var Folder = Class.create({
    init: function () {
        this.title = arguments[0];
        this.urls = [];
        for (var count = 1; count < arguments.length; count++) {
            this.urls.push(arguments[count]);
        }
    },
    getFolder: function () {
        var list = document.createElement('ul');
        list.innerHTML = this.title;

        // Create li element for each url in the folder and appent it as a element by getAnchor methid
        for (var count = 0; count < this.urls.length; count++) {
            var element = document.createElement('li');
            var link = this.urls[count].getAnchor();
            element.appendChild(link);
            element.style.display = 'none';
            list.appendChild(element);
        }

        // Add event onclick to ul element (change display property of its li childs onclick)
        list.addEventListener('click', changeDisplay, false);
        function changeDisplay(e) {
            var ul = e.target;
            var li = ul.firstElementChild;
            if (li) {
                if (li.style.display === 'none') {
                    while (li) {
                        li.style.display = '';
                        li = li.nextElementSibling;
                    }
                }
                else {
                    while (li) {
                        li.style.display = 'none';
                        li = li.nextElementSibling;
                    }
                }
            }

        }

        return list;
    }
});

// Object SiteBar with properties folders, urls and method append which append div element to document.body
var SiteBar = Class.create({
    init: function () {
        this.folders = arguments[0];
        this.urls = arguments[1];
    },
    append: function () {
        // Create div element
        var siteBar = document.createElement('div');

        // Append folders as ul elments
        for (var count = 0; count < this.folders.length; count++) {
            var folderElement = this.folders[count].getFolder();
            siteBar.appendChild(folderElement);
        }

        // Append urls as a elments
        for (var count = 0; count < this.urls.length; count++) {
            var linkElement = this.urls[count].getAnchor();
            siteBar.appendChild(linkElement);
        }

        document.body.appendChild(siteBar);
    }
});

// Example
var first = new Url("first", "http://www.w3schools.com");
var second = new Url("second", "https://www.google.bg/");
var third = new Url("third", "http://telerikacademy.com/");
var folder = new Folder("www", first, second);
var favorite = new SiteBar([folder], [third]);
favorite.append();