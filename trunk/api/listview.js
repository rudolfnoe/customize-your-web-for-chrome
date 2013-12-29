(function(){
   var defaultSettings = {
      "focusOnLoad": true,
      "highlightCss": 'background-color:#A0E0F0',
      "linkTarget": LinkTarget.CURRENT,
      "noOfHeaderRows": 1,
      "linkNoToOpen" : 1,
      "shortcut": null,
      "pos": "first",
      "mutationSummarySelector": null
   }
   
   var listviewActions = []
   
   listview = function(rootElementSelector, listItemSelectorOrJQueryObj, options){
      var listviewAction = new ListViewAction(rootElementSelector, listItemSelectorOrJQueryObj, options);
      listviewActions.push(listviewAction);
   };
   
   function ListViewAction(rootElementSelector, listItemSelectorOrJQueryObj, options){
      var self = this;
      Assert.notNull(rootElementSelector);
      Assert.notNull(listItemSelectorOrJQueryObj);
      this.rootElementSelector = rootElementSelector
      this.listItemSelectorOrJQueryObj = listItemSelectorOrJQueryObj;
      this.listviewHandler = null;
      this.settings = $.extend({}, defaultSettings, options);
      if(this.settings.shortcut){
         shortcut(this.settings.shortcut, function(){
            focus(self.rootElementSelector, {"pos":self.settings.pos});
         });
      }
      var rootNode = APIHelper.getSingleElement(this.rootElementSelector, this.settings.pos);
      if (rootNode){
         
         this.mutationSummery = new MutationSummary({
            callback: self.init.bind(self),
            rootNode: rootNode,
            queries: [{element: '*'}]
         })
      } else {
         console.log('listview no rootnode found');
         this.mutationSummeryRootNodeMissing = new MutationSummary({
            callback: self.init.bind(self),
            queries: [{element: '#ires'}]
         }) 
         return;
      }
      this.init();
   };
   
   ListViewAction.prototype.init = function(){
      console.log('listview init')
      if(this.listviewHandler){
         this.listviewHandler.destroy();
      }
      var rootElement = APIHelper.getSingleElement(this.rootElementSelector, this.settings.pos);
      var $listItems = typeof this.listItemSelectorOrJQueryObj == "string"?$(this.listItemSelectorOrJQueryObj, rootElement):this.listItemSelectorOrJQueryObj;
      this.listviewHandler = new ListViewHandler(rootElement, $listItems.toArray(), this.settings.highlightCss, this.settings.linkTarget, this.settings.linkNoToOpen);
      if(this.settings.focusOnLoad){
         focus(this.rootElementSelector);
      }
   }

})()