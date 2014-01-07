(function(){
   var defaultSettings = {
      "button": 0,
      "modifierMask": 0,
      "pos": "first",
      "linkTarget": LinkTarget.CURRENT 
   }
   click = function(selectorOrElem, opts){
   	var elem;
      var settings = $.extend({}, defaultSettings, opts); 
      if (typeof selectorOrElem === "string"){
      	elem = APIHelper.getSingleElement(selectorOrElem, settings.pos);
      }else{
      	elem = selectorOrElem;
      }
      if(!elem){
      	console.warn('CYW click: Target not found for selector "' + selectorOrElem + '"');
      	return;
      }
      var link = $(elem).closest('a').get(0);
      if (link && settings.linkTarget == LinkTarget.TAB){
      	(new LinkWrapper(link)).open(LinkTarget.TAB);
      } else {
	      performEvent(elem, "mouseover", settings.modifierMask, settings.button);
	      performEvent(elem, "mousedown", settings.modifierMask, settings.button);
	      performEvent(elem, "click", settings.modifierMask, settings.button);
	      performEvent(elem, "mouseupd", settings.modifierMask, settings.button);
      }
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
