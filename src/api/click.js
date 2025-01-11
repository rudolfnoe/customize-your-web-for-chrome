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
      let clickEvent = new MouseEvent(type, {
         detail: type=="click"?1:2,
         bubbles: true,
         cancelable: true,         
         view: window,
         screenX: 0,
         screenY: 0,
         clientX: 0,
         clientY: 0,
         ctrlKey: modifierMask & ShortcutManager.CTRL, 
         altKey: modifierMask & ShortcutManager.ALT, 
         shiftKey: modifierMask & ShortcutManager.SHIFT, 
         button: button
      })
      return target.dispatchEvent(clickEvent)?1:0
   }
   
   
})()
