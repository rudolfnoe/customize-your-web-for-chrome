(function(){
   var defaultSettings = {
      "focusOnLoad": true,
      "highlightCss": 'background-color:#A0E0F0',
      "linkTarget": LinkTarget.CURRENT,
      "noOfHeaderRows": 1,
      "linkNoToOpen" : 1,
      "shortcut": null,
      "pos": "first"
   }
   
   var listviewHandlers = []
   
   listview = function(rootElementSelector, listItemSelectorOrJQueryObj, options){
      Assert.notNull(rootElementSelector);
      Assert.notNull(listItemSelectorOrJQueryObj);
      var settings = $.extend({}, defaultSettings, options);
      var rootElement = APIHelper.getSingleElement(rootElementSelector, settings.pos);
      var $listItems = typeof listItemSelectorOrJQueryObj == "string"?$(listItemSelectorOrJQueryObj, rootElement):listItemSelectorOrJQueryObj;
      var listviewHandler = new ListViewHandler(rootElement, $listItems.toArray(), settings.highlightCss, settings.linkTarget, settings.linkNoToOpen);
      listviewHandlers.push(listviewHandler);
      if(settings.shortcut){
         shortcut(settings.shortcut, function(){
            focus(rootElementSelector, {"pos":settings.pos});
         });
      }
      if(settings.focusOnLoad){
         focus(rootElementSelector);
      }
   }

})()