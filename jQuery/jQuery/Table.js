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

// Object Table with properties columns and method create which return DOM element table
var Table = Class.create({
    init: function () {
        this.columns = [];
        for (var count = 0; count < arguments.length; count++) {
            this.columns.push(arguments[count]);
        }
    },
    create: function () {
        // Object from wich is going to be extracted the information for the table
        var objects = [];
        for (var count = 0; count < arguments.length; count++) {
            objects.push(arguments[count]);
        }

        // Create DOM element table and load the data from array objects
        var table = $('<table border="1"></table>');
        var head = $('<thead></thead>');
        var headRow = $('<tr></tr>');
        for (var count = 0; count < this.columns.length; count++) {
            headRow.append('<th>' + this.columns[count] + '</th>');
        }

        head.append(headRow);
        table.append(head);

        var body = $('<tbody></tbody>');
        for (var count = 0; count < objects.length; count++) {
            var current = objects[count];
            var bodyRow = $('<tr></tr>');
            for (var prop in current) {
                if (prop !== 'init') {
                    bodyRow.append('<td>' + current[prop] + '</td>');
                }
            }

            body.append(bodyRow);
        }

        table.append(body);
        return table;
    }
});

// Object Student with properties firstName, lastName, grade
var Student = Class.create({
    init: function () {
        this.firstName = arguments[0];
        this.lastName = arguments[1];
        this.grade = arguments[2];
    }
});

// Example
var first = new Student('Peter', 'Ivanov', 3);
var second = new Student('Milena', 'Grigorova', 6);
var third = new Student('Gergana', 'Borisova', 12);
var table = new Table('First Name', 'Last Name', 'Grade');
var domTable = table.create(first, second, third);
$('body').append(domTable);