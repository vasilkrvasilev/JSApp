(function ($) {
    $.fn.treeView = function () {
        var elements = this;
        // Add onclick event, which change the display style 
        // of all siblings of the selected elements and returns them
        elements.on("click", function (event) {
            var selected = $(event.target).siblings();
            var state = selected.first().css('display');
            if (state === 'none') {
                selected.css('display', '');
            }
            else {
                selected.css('display', 'none');
            }
        });
		
        return this;
    }
}(jQuery))