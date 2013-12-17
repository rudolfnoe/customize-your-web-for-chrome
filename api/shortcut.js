(function(){
   //Single Instance of ShortcutManager
   var sm = null;
   //Single Instance of ShortStringManager
   var smm = null;
   
   //Default options
   var defaultOptions = {
      "keyCombination": null,
      "selector": null,
      "callback" : null,
      "pos": "first",
      //one of current, tab, window
      "linkTarget": "current"
   }

   
   shortcut = function(keyCombination, selectorOrFunctionOrOptions){
         var options, callback;
         if (typeof selectorOrFunctionOrOptions == "string" ){
            var settings = $.extend(defaultOptions, {keyCombination:keyCombination, selector:selectorOrFunctionOrOptions});
         }else if (typeof selectorOrFunctionOrOptions == "function" ){
            var settings = $.extend(defaultOptions, {keyCombination:keyCombination, callback:selectorOrFunctionOrOptions});
         }else{
            //keyCombination is options object
            var settings = $.extend(defaultOptions, {keyCombination:keyCombination}, selectorOrFunctionOrOptions);
         }
         if (settings.selector){
            var clickOptions = {pos:settings.pos};
            if (settings.linkTarget == "tab"){
               clickOptions.modifierMask = ShortcutManager.CTRL
            }
            var focusOptions = {pos:settings.pos}
            //JQuery Identifier --> Click it
            var callback = function(){
               click(settings.selector, clickOptions);
               focus(settings.selector, focusOptions);
            }
         }else if(settings.callbackFct){
            var callback = settings.callback;
         }else{
            throw new Error('Shortcut.add: Unknown Command');
         }
         if(settings.keyCombination.indexOf("+")==-1){
            //Shortstring
            if (smm == null){
               ssm = new ShortStringManager(window, 500, "ESCAPE");
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