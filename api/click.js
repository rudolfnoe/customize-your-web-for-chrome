(function(){
   var defaultOptions = {
      "button": 0,
      "modifierMask": 0,
      "fistOrLast": "first"
   }
   click = function(jQuerySelector, opts){
      var settings = $.extend(defaultOptions, opts); 
      if (settings.firstOrLast == "first"){
         var elem = $(jQuerySelector).first().get(0);
      }else{
         var elem = $(jQuerySelector).last().get(0);
      }
      performEvent(elem, "mouseover", settings.modifierMask, settings.button);
      performEvent(elem, "mousedown", settings.modifierMask, settings.button);
      performEvent(elem, "click", settings.modifierMask, settings.button);
      performEvent(elem, "mouseupd", settings.modifierMask, settings.button);
   };

   function performEvent(target, type, modifierMask, button){
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initMouseEvent(type, //type
                              true, //canBubble
                              true, //cancelable
                              window, //view
                              1, //click count
                              0, 0, 0, 0, //screenX, screenY, clientX, clientY,
                              modifierMask & ShortcutManager.CTRL, 
                              modifierMask & ShortcutManager.ALT, 
                              modifierMask & ShortcutManager.SHIFT, 
                              false,
                              button, null); //relatedTarget
      return target.dispatchEvent(clickEvent)?1:0
   }
   
   
})()
