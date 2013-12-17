(function(){
   var defaultOptions = {
      "button": 0,
      "modifierMask": 0,
      "pos": "first"
   }
   click = function(selector, opts){
      var settings = $.extend(defaultOptions, opts); 
      var elem = APIHelper.getSingleElement(selector, settings.pos);
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
