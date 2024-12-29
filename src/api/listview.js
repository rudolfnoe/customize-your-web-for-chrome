(function(){
   var defaultSettings = {
      "focusOnLoad": true,
      "highlightCss": 'background-color:#dee8f7',
      "linkTarget": LinkTarget.CURRENT,
      "noOfHeaderRows": 1,
      "linkNoToOpen" : 1,
      "linkSelectorToOpen" : null,
      "shortcut": null,
      "pos": "first",
      "mutationObserverSelector": null
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

      var rootNode = APIHelper.getSingleElement(rootElementSelector, this.settings.pos);
      
      //TODO make this more efficient
      this.mutationObserver = new MutationObserver(self.init.bind(self));
      
      var mutationObeserRootNode = rootNode;
      if (this.settings.mutationObserverSelector){
      	mutationObeserRootNode = APIHelper.getSingleElement(this.settings.mutationObserverSelector, 'first');
      	if (!mutationObeserRootNode){
      		console.warn('CYW listview: mutationObserverRootNode could not be found with selector ' + this.settings.mutationObserverSelector);
      	}
      }
      if (mutationObeserRootNode) {
   		this.mutationObserver.observe(mutationObeserRootNode, {childList:true, subtree:true});
	  }
	
	  if (rootNode) {
		this.init();
	  }
   };
   
   ListViewAction.prototype.init = function(){
      //console.log('listview init')
      if(this.listviewHandler){
         this.listviewHandler.destroy();
      }
      var rootElement = APIHelper.getSingleElement(this.rootElementSelector, this.settings.pos);
      if (!rootElement){
      	return;
      }
      var $listItems = typeof this.listItemSelectorOrJQueryObj == "string"?$(this.listItemSelectorOrJQueryObj, rootElement):this.listItemSelectorOrJQueryObj;
      //filter header rows
      if (this.settings.noOfHeaderRows > 0){
      	$listItems = $listItems.filter(':gt(' + (this.settings.noOfHeaderRows-1) + ')');
      }
      this.listviewHandler = new ListViewHandler(rootElement, $listItems.toArray(), this.settings.highlightCss, this.settings.linkTarget, this.settings.linkSelectorToOpen!=null?this.settings.linkSelectorToOpen:this.settings.linkNoToOpen);
      if(this.settings.focusOnLoad){
         focus(this.rootElementSelector);
      }
   }

})()