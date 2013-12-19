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
         var options, callback;
         if (typeof selectorOrFunctionOrOptions == "string" ){
            var settings = $.extend({}, defaultSettings, {keyCombination:keyCombination, selector:selectorOrFunctionOrOptions});
         }else if (typeof selectorOrFunctionOrOptions == "function" ){
            var settings = $.extend({}, defaultSettings, {keyCombination:keyCombination, callback:selectorOrFunctionOrOptions});
         }else{
            //keyCombination is options object
            var settings = $.extend({}, defaultSettings, $.extend({keyCombination:keyCombination}, selectorOrFunctionOrOptions));
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
         }else if(settings.callback){
            var callback = settings.callback;
         }else{
            throw new Error('Shortcut.add: Unknown Command');
         }
         if(settings.keyCombination.indexOf("+")==-1 && !KeyCodeMapper[settings.keyCombination]){
            //Shortstring
            if (ssm == null){
               ssm = new ShortStringManager(window, 500, "Ctrl+SPACE");
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