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

// Object GridView with properties columns, header, rows, nestedTable, table and 
// Methods addHeader, addRow, addNestedTable the last one return object of type GridView
var GridView = Class.create({
    init: function () {
        this.columns = arguments[0];
        this.header = [];
        this.rows = [];
        this.nestedTable = [];
        this.table = $('<table border="1"><thead></thead><tbody></tbody><tfoot></tfoot></table>');
    },
    addHeader: function () {
        // Clear old header and add new
        this.header = [];
        for (var count = 0; count < this.columns; count++) {
            this.header.push(arguments[count]);
        }

        // Create thead tag and append it to the table
        this.table.find('thead').first().remove();
        var head = $('<thead></thead>');
        var headRow = $('<tr></tr>');
        for (var count = 0; count < this.header.length; count++) {
            headRow.append('<th>' + this.header[count] + '</th>');
        }

        head.append(headRow);
        this.table.prepend(head);
    },
    addRow: function () {
        // Create new row
        var currentRow = [];
        for (var count = 0; count < this.columns; count++) {
            currentRow.push(arguments[count]);
        }

        // Create new tr tag and append it to table body
        var body = this.table.find('tbody').first();
        var bodyRow = $('<tr></tr>');
        for (var count = 0; count < currentRow.length; count++) {
            bodyRow.append('<td>' + currentRow[count] + '</td>');
        }

        body.append(bodyRow);
        this.rows.push(currentRow);
    },
    addNestedTable: function () {
        // Clear old nested table, create new and append it to table footer (nested.table)
        this.nestedTable = [];
        this.table.find('tfoot').first().remove();
        var foot = $('<tfoot><tr><td></td></tr></tfoot>');
        var footData = foot.find('td');
        footData.attr('colSpan', '' + this.columns)
        var nested = new GridView(arguments[0]);
        footData.append(nested.table);
        this.table.append(foot);
        this.nestedTable.push(nested);
        return nested;
    }
});

// Example
var table = new GridView(4);
table.addHeader('A', 'B', 'C', 'D');
table.addRow('a', 'b', 'c', 'd');
table.addRow('w', 'x', 'y', 'z');
var nested = table.addNestedTable(3);
nested.addHeader('2', '3', '5');
nested.addRow('@', '#', '%');
nested.addRow('k', 'l', 'i');
$('body').append(table.table);