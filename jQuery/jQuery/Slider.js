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

// Object Slide with properties source, title and method loadSlide add new content to a DOM element
var Slide = Class.create({
    init: function () {
        this.source = arguments[0];
        this.title = arguments[0].split('.')[0];
    },
    loadSlide: function () {
        var element = $(arguments[0]);
        element.load(this.source);
        var header = $('h1');
        header.html(this.title);
    }
});

// Object SliderControl
var SliderControl = Class.create({
    init: function () {
        // Selector of the DOM element where the slider is appended
        var divId = arguments[0];
        // Objects of type Slide - all slides in the slider
        var slides = [];
        for (var count = 3; count < arguments.length; count++) {
            slides.push(arguments[count]);
        }

        slides[0].loadSlide(divId);

        // Add events to the left and right arrow buttons
        var left = $(arguments[1]);
        left.on('click', moveLeft);
        var right = $(arguments[2]);
        right.on('click', moveRight);

        // Define the event function when left arrow button is clicked (chenge the slide with the previous one)
        function moveLeft() {
            var index = findCurrentIndex();
            if (index == 0) {
                index = slides.length - 1;
            }
            else {
                index--;
            }

            changeSlide(index);
        }

        // Define the event function when right arrow button is clicked (chenge the slide with the next one)
        function moveRight() {
            var index = findCurrentIndex();
            if (index == slides.length - 1) {
                index = 0;
            }
            else {
                index++;
            }

            changeSlide(index);
        }

        // Find the index of current slide in the slider in the array slides
        function findCurrentIndex() {
            var current = $('h1')[0];
            var index = 0;
            for (var count = 0; count < slides.length; count++) {
                if (slides[count].title === current.innerHTML) {
                    index = count;
                    break;
                }
            }

            return index;
        }

        // Change slide in the slider (remove the previous and load the current)
        function changeSlide(index) {
            var div = $(divId);
            div.children().remove();
            slides[index].loadSlide(divId);
        }

        // Change slide in the slider with the next automatically
        var interval = setInterval(function () {
            moveRight();
        }, 5000);
    }
});

// Example
var first = new Slide('FirstSlide.html');
var second = new Slide('SecondSlide.html');
var third = new Slide('ThirdSlide.html');
var slider = new SliderControl('#content', '#left', '#right', first, second, third);