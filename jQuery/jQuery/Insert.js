// Create closure insert with properties (functions) after and before
var insert = (function () {
    function after() {
        var element = $(arguments[0]);
        var elementToInsert = $(arguments[1]);
        elementToInsert.insertAfter(element);
    }

    function before() {
        var element = $(arguments[0]);
        var elementToInsert = $(arguments[1]);
        elementToInsert.insertBefore(element);
    }

    return {
        after: after,
        before: before
    }
})();

// Example
var holder = $('#holder')[0];
insert.after(holder, '<p>Text</p>');
insert.before(holder, '<h1>Header</h1>');