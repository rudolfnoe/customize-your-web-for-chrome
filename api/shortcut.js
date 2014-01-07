(function(){
   //Single Instance of ShortcutManager
   var sm = null;
   //Single Instance of ShortStringManager
   var ssm = null;
   
   //Default options
   var defaultSettings = {
      "keyCombination": null,
      "selector": null,
      "callback" : null,
      "pos": "first",
      //one of current, tab, window
      "linkTarget": LinkTarget.CURRENT
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
            var focusOptions = {pos:settings.pos}
            //JQuery Identifier --> Click it
            callback = function(){
	            click(settings.selector, clickOptions);
	            focus(settings.selector, focusOptions);
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
               ssm = new ShortStringManager(window, 300, "Ctrl+SHIFT+SPACE");
            }
            ssm.addShortcut(settings.keyCombination, function(){
               callback();
               //Prevent default 
               return ShortcutManager.SUPPRESS_KEY;
            });
         }else{
            if (sm == null){
               sm = new ShortcutManager(window, "keydown", false);
            }
            sm.addShortcut(settings.keyCombination, callback);
         }
      }
})()