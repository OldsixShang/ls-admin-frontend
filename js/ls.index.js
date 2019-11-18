var page = page || {};
(function($) {
    $.extend(page, {
        slide: function(el) {
            var $el = $(".nav-left .operate-item.slider .ls-icon");
            var slider = $(".ls-layout-slider");
            if (slider.hasClass("contracted")) {
                slider.removeClass("contracted");
                $el.removeClass("ls-icon-shrink-right");
            } else {
                slider.addClass("contracted");
                $el.addClass("ls-icon-shrink-right");
            }
        },
        expand: function(item) {
            var $item = $(item);
            var pid = $item.attr("pid");
            //debugger
            if ($item.children("b").hasClass('fa-angle-left')) {
                $item.parent().children("ul").addClass("expanded");
                $item.children("b").removeClass('fa-angle-left').addClass('fa-angle-down');
            } else {
                $item.parent().children("ul").removeClass("expanded");
                $item.children("b").removeClass('fa-angle-down').addClass('fa-angle-left');
            }
        }
    });
})(jQuery);