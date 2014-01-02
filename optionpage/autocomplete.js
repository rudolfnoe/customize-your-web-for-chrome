(function(){
	var ac_entries = ['click();',
	                  'click(selector, {"button": 0,  "modifierMask": ShortcutManager.CTRL|ShortcutManager.SHIFT|ShortcutManager.ALT,"pos":"first"});',
	                  'focus();',
	                  'focus(selector, {pos:"frist", select:true});',
	                  'listview();',
	                  'listview(rootElementSelector, listItemSelectorOrJQueryObj);',
	                  'listview(rootElementSelector, listItemSelectorOrJQueryObj,{"shortcut": null, "focusOnLoad": true, "linkTarget": LinkTarget.TAB, "noOfHeaderRows": 1, "linkNoToOpen" : 1, "pos": "first", "mutationSummarySelector": null});',
	                  'shortcut();',
	                  'shortcut(keyCombination, selector);',
	                  'shortcut(keyCombination, function() { });',
	                  'shortcut(keyCombination, {"selector": null, "callback" : function(){ }, "pos": "first", "linkTarget": LinkTarget.TAB});',
	               	]; 
	var cyw_function_names = ['shortcut', 'listview'];
	$(function(){
		var strategies = [{
			match:    /(^|\s*)((sh|li|fo|cl)\w*)$/i,
			search:   function (term, callback) {
					callback(ac_entries.filter(function(value){
						return value.toLowerCase().indexOf(term.toLowerCase()) == 0 &&
							cyw_function_names.indexOf(term.toLowerCase()) == -1
					}));
				},
			  replace:  function(value){
				  var firstParenthesesIndex = value.indexOf('(');
				  if (firstParenthesesIndex != -1) {
				  	 return ['$1'+value.substring(0, firstParenthesesIndex+1), value.substring(firstParenthesesIndex+1)];					  
				  }else{
					  return '$1'+value;
				  }
			  }
		}]
		$('#onloadJSCode').textcomplete(strategies).focus();
	});
})();