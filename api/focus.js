(function() {
	var defaultSettings = {
		"pos" : "first",
		"select" : true
	}
	focus = function(selector, opts) {
		var settings = $.extend({}, defaultSettings, opts);
		var target = APIHelper.getSingleElement(selector, settings.pos);
		if (!target) {
			return;
		}
		if (DomUtils.isEditableIFrame(target)) {
			target.contentDocument.defaultView.focus()
			var body = $('body', target.contentDocument).get(0);
			if (body) {
				body.focus()
			}
		} else if (target.tagName == "IFRAME" || target.tagName == "FRAME") {
			target.contentDocument.defaultView.focus()
		} else if (target.focus && (!settings.select || !target.select)){
         var $target = $(target);
         var curTabindex = $target.attr('tabindex');
         if (!curTabindex){
            $target.attr('tabindex', '0');
         }
         target.focus()
         $target.attr('tabindex', curTabindex);
      } else if (target.select && settings.select){
         target.select();
      } else {
			console.log('focus programming eror: unhandled condition');
			elemWrapper.restore()
		}
	};
})()
