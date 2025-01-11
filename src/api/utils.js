(function(){
	exists = function(selector) {
		return $(selector).length > 0
	};
	
	notExists = function(selector){
		return !exists(selector);
	}
})();