(function() {
	APIHelper = {
		getSingleElement : function(selector, pos) {
			if (!pos || pos  == "first") {
				return $(selector).first().get(0);
			} else {
				return $(selector).last().get(0);
			}
         
		}
	}
})();