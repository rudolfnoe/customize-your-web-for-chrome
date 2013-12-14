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

   
   shortcut = function(keyCombinationOrOptionObj, jQuerySelectorForTarget){
         var options, callbackFct;
         if (typeof keyCombinationOrOptionObj == "string" ){
            var settings = $.extend(defaultOptions, {});
            settings.keyCombination = keyCombinationOrOptionObj;
            settings.jQuerySelectorForTarget = jQuerySelectorForTarget;
         }else{
            //keyCombinationOrOptionObj is options object
            var settings = $.extend(defaultOptions, keyCombinationOrOptionObj);
         }
         if (settings.jQuerySelectorForTarget){
            var clickOptions = {};
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