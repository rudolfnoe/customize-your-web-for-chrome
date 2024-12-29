(function(){
   //Map of ShortcutManager
	//Key Selector Value Shortcutmanager Instance
   var sm = {};
   //Single Instance of ShortStringManager
   var ssm = null;
   
   //Default options
   var defaultSettings = {
      "keyCombination": null,
      "selector": null,
      "callback" : null,
      "pos": "first",
      //one of current, tab, window
      "linkTarget": LinkTarget.CURRENT,
      "eventScopeSelector": 'window',
      "select":true 
   }

   
   shortcut = function(keyCombination, selectorOrFunctionOrOptions){
         var settings = null, callback = null;
         keyCombination = keyCombination.toUpperCase();
         if (typeof selectorOrFunctionOrOptions == "string" ){
            settings = $.extend({}, defaultSettings, {keyCombination:keyCombination, selector:selectorOrFunctionOrOptions});
         }else if (typeof selectorOrFunctionOrOptions == "function" ){
            settings = $.extend({}, defaultSettings, {keyCombination:keyCombination, callback:selectorOrFunctionOrOptions});
         }else{
            //keyCombination is options object
            var settings = $.extend({}, defaultSettings, $.extend({keyCombination:keyCombination}, selectorOrFunctionOrOptions));
         }
         if (settings.selector){
            var clickOptions = {pos:settings.pos, linkTarget:settings.linkTarget};
            var focusOptions = {pos:settings.pos, select:settings.select}
            //JQuery Identifier --> Click it
            callback = function(){
            	//blur first for doing things on blur (bug with apex addon, textarea)
            	var elem = APIHelper.getSingleElement(settings.selector, settings.pos);
            	if (elem && elem.blur){
            		elem.blur();
            	}
            	focus(settings.selector, focusOptions);
           		click(settings.selector, clickOptions);
            }
         }else if(settings.callback){
            callback = settings.callback;
         }else{
            throw new Error('Shortcut.add: Unknown Command');
         }
         if(settings.keyCombination.indexOf("+")==-1 && 
         		(!KeyCodeMapper[settings.keyCombination] || 
         				(KeyCodeMapper[settings.keyCombination] >= 48 && KeyCodeMapper[settings.keyCombination]<=111) )){
            //Shortstring
            if (ssm == null){
               ssm = new ShortStringManager(window, 400, "Ctrl+SHIFT+SPACE");
            }
            ssm.addShortcut(settings.keyCombination, function(){
               callback();
               //Prevent default 
               return ShortcutManager.SUPPRESS_KEY;
            });
         }else{
            if (sm[settings.eventScopeSelector] == null){
            	var eventScopeElements = settings.eventScopeSelector=='window'?window:$(settings.eventScopeSelector).toArray();
            	sm[settings.eventScopeSelector] = new ShortcutManager(eventScopeElements, "keydown", null);
            }
            sm[settings.eventScopeSelector].addShortcut(settings.keyCombination, callback);
         }
      }
})()