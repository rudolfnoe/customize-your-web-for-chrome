(function(){
   //Single Instance of ShortcutManager
   var sm = null;
   //Single Instance of ShortStringManager
   var smm = null;

   
   Shortcut = {
      add: function(keyCombination, callbackFctOrJQuerySelector){
         if (typeof callbackFctOrJQuerySelector == "string"){
            //JQuery Identifier --> Click it
            var callbackFct = function(){
               Click(callbackFctOrJQuerySelector);
            }
         }else if(typeof callbackFctOrJQuerySelector == "function"){
            callbackFct = callbackFctOrJQuerySelector;
         }else{
            throw new Error('Shortcut.add: Unknown Command');
         }
         if(keyCombination.indexOf("+")==-1){
            //Shortstring
            if (smm == null){
               ssm = new ShortStringManager(window, 500, "ESCAPE");
            }
            ssm.addShortcut(keyCombination, callbackFct);
         }else{
            if (sm == null){
               sm = new ShortcutManager(window, "keydown", false);
            }
            sm.addShortcut(keyCombination, callbackFct);
         }
      }
   }
})()