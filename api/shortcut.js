(function(){
   //Single Instance of ShortcutManager
   var sm = null;
   //Single Instance of ShortStringManager
   var smm = null;
   
   //Default options
   var defaultOptions = {
      "keyCombination": null,
      "jQuerySelectorForTarget": null,
      "callbackFct" : null,
      "firstOrLast": "first",
      //one of current, tab, window
      "linkTarget": "current"
   }

   
   shortcut = function(keyCombination, selectorOrOptions){
         var options, callbackFct;
         if (typeof selectorOrOptions == "string" ){
            var settings = $.extend(defaultOptions, {keyCombination:keyCombination, jQuerySelectorForTarget:selectorOrOptions});
         }else{
            //keyCombination is options object
            var settings = $.extend(defaultOptions, {keyCombination:keyCombination}, selectorOrOptions);
         }
         if (settings.jQuerySelectorForTarget){
            var clickOptions = {fistOrLast:settings.firstOrLast};
            if (settings.linkTarget == "tab"){
               clickOptions.modifierMask = ShortcutManager.CTRL
            }
            //JQuery Identifier --> Click it
            var callbackFct = function(){
               click(settings.jQuerySelectorForTarget, clickOptions);
            }
         }else if(settingscallbackFct){
            var callbackFct = settings.callbackFct;
         }else{
            throw new Error('Shortcut.add: Unknown Command');
         }
         if(settings.keyCombination.indexOf("+")==-1){
            //Shortstring
            if (smm == null){
               ssm = new ShortStringManager(window, 500, "ESCAPE");
            }
            ssm.addShortcut(settings.keyCombination, callbackFct);
         }else{
            if (sm == null){
               sm = new ShortcutManager(window, "keydown", false);
            }
            sm.addShortcut(settings.keyCombination, callbackFct);
         }
      }
})()