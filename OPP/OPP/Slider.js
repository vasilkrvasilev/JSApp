// Method create to create an object from the lecture (demo) - Prototypal OOP
if (!Object.create) {
    Object.create = function (obj) {
        function f() { };
        f.prototype = obj;
        return new f();
    }
}

// Method extend to inherit an object from the lecture (demo) - Prototypal OOP
if (!Object.prototype.extend) {
    Object.prototype.extend = function (properties) {
        function f() { };
        f.prototype = Object.create(this);
        for (var prop in properties) {
            f.prototype[prop] = properties[prop];
        }
        f.prototype._super = this;
        return new f();
    }
}

// Use canvas to draw left arrow button
function drawLeft() {
    var left = arguments[0].getContext('2d');
    left.lineWidth = 2;
    left.strokeStyle = 'green';
    left.fillStyle = 'white';
    left.fillRect(0, 0, left.canvas.width, left.canvas.height);
    left.strokeRect(0, 0, left.canvas.width, left.canvas.height);
    left.strokeStyle = 'blue';
    left.lineWidth = 5;
    left.beginPath();
    left.moveTo(40, 10);
    left.lineTo(40, 40);
    left.lineTo(10, 25);
    left.lineTo(40, 10);
    left.lineTo(40, 40);
    left.stroke();
}

// Use canvas to draw right arrow button
function drawRight() {
    var right = arguments[0].getContext('2d');
    right.lineWidth = 2;
    right.strokeStyle = 'green';
    right.fillStyle = 'white';
    right.fillRect(0, 0, right.canvas.width, right.canvas.height);
    right.strokeRect(0, 0, right.canvas.width, right.canvas.height);
    right.strokeStyle = 'blue';
    right.lineWidth = 5;
    right.beginPath();
    right.moveTo(10, 10);
    right.lineTo(10, 40);
    right.lineTo(40, 25);
    right.lineTo(10, 10);
    right.lineTo(10, 40);
    right.stroke();
}

// Object Image with properties title, small, big and method getImg which return DOM element img
var Image = {
    init: function (title, small, big) {
        this.title = title;
        this.small = small;
        this.big = big;
    },
    getImg: function () {
        // Create DOM element img and set its properties
        var image = document.createElement('img');
        image.src = this.small;
        image.title = this.title;
        var small = this.small;
        var big = this.big;

        // Add event onclick to img element (change size of the img onclick)
        image.addEventListener('click', changeSize);
        function changeSize() {
            if (image.src.indexOf(small) !== -1) {
                image.src = big;
            }
            else {
                image.src = small;
            }
        }

        return image;
    }
};

// Object Slider with properties divId, leftId, rightId
var Slider = {
    init: function () {
        this.divId = arguments[0];
        this.leftId = arguments[1];
        this.rightId = arguments[2];

        // Keep objects of type Image of the slider in array images
        var images = [];
        for (var count = 3; count < arguments.length; count++) {
            images.push(arguments[count]);
        }

        // Keep the div element where slider will be placed in variable div
        var div = document.getElementById(this.divId);
        div.appendChild(images[0]);

        // Keep the elements where arrow will be placed in variables left and right and add events
        var left = document.getElementById(this.leftId);
        left.addEventListener('click', moveLeft);
        drawLeft(left);
        var right = document.getElementById(this.rightId);
        right.addEventListener('click', moveRight);
        drawRight(right);

        // Define the event function when left arrow button is clicked (chenge the image with the previous one)
        function moveLeft() {
            var index = findCurrentIndex();
            if (index == 0) {
                index = images.length - 1;
            }
            else {
                index--;
            }

            changeImage(index);
        }

        // Define the event function when right arrow button is clicked (chenge the image with the next one)
        function moveRight() {
            var index = findCurrentIndex();
            if (index == images.length - 1) {
                index = 0;
            }
            else {
                index++;
            }

            changeImage(index);
        }

        // Find the index of current image in the slider in the array inages
        function findCurrentIndex() {
            var current = div.getElementsByTagName('img')[0];
            var index = 0;
            for (var count = 0; count < images.length; count++) {
                if (images[count].title === current.title) {
                    index = count;
                    break;
                }
            }

            return index;
        }

        // Change image in the slider (remove the previous and add the current)
        function changeImage(index) {
            var child = div.getElementsByTagName('img');
            div.removeChild(child[0]);
            div.appendChild(images[index]);
        }
    }
};

// Example
var first = Object.create(Image);
first.init('algorithm', 'images/algorithmSmall.jpg', 'images/algorithmBig.jpg');
var second = Object.create(Image);
second.init('software', 'images/softwareSmall.jpg', 'images/softwareBig.jpg');
var third = Object.create(Image);
third.init('wow', 'images/wowSmall.jpg', 'images/wowBig.jpg');
var imageSlider = Object.create(Slider);
imageSlider.init('carousel', 'canvas-left', 'canvas-right', first.getImg(), second.getImg(), third.getImg());