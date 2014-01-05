(function(){
   const EVENT_TYPES_FOR_ROOT_CAPTURE_TRUE = ["click", "focusout"];
   const EVENT_TYPES_FOR_ROOT_CAPTURE_FALSE = ["focus"];
   const CURRENT_INDEX_ATTR = 'cyw_currentIndex';
   
   ListViewHandler = function (rootElement, listItems, highlightCss, defaultLinkTarget, linkNoToOpen){
      Assert.paramsNotNull(arguments)
      this.currentIndex = 0
      this.currentItemWrapper = null
      this.defaultLinkTarget = defaultLinkTarget
      this.linkNoToOpen = linkNoToOpen
      this.focused = false
      this.highlightCss = highlightCss
      this.listItems = listItems
      this.rootElement = rootElement
      if(this.rootElement.hasAttribute(CURRENT_INDEX_ATTR))
      this.currentIndex = parseInt(this.rootElement.getAttribute(CURRENT_INDEX_ATTR), 10)
      var tabIndex = $(rootElement).prop('tabIndex');
      if (!tabIndex){
      	$(rootElement).prop('tabIndex', '0');
      }
      this.scm = new ShortcutManager(rootElement, "keydown", true)
      //ElementWrappers for td-tags with non-transparent background
      this.currentTdTagWrappers = []
      this.registerMultipleEventListener(this.rootElement, EVENT_TYPES_FOR_ROOT_CAPTURE_TRUE, true)
      this.registerMultipleEventListener(this.rootElement, EVENT_TYPES_FOR_ROOT_CAPTURE_FALSE, false)
      this.initShortcuts()
   };
   
   ListViewHandler.prototype = {
      checkBlur: function(){
         var focusedElement = $(document).prop('activeElement');
         console.log('checkblur activeElement: ' + focusedElement.innerText.substring(1,30));
         console.log('checkblur rootElement: ' + this.rootElement.innerText.substring(1,30));
         var isBlurred = true
         if(focusedElement){
            var compDocPosResult = this.rootElement.compareDocumentPosition( focusedElement )
            if((compDocPosResult & Node.DOCUMENT_POSITION_CONTAINED_BY)!=0 || this.rootElement == focusedElement){
               var isBlurred = false
            }
         }
         if(isBlurred) {
            this.updateHighlighting(-1, false)
         }
      },
      destroy: function(){
         this.unRegisterMultipleEventListener(this.rootElement, EVENT_TYPES_FOR_ROOT_CAPTURE_TRUE, true)
         this.unRegisterMultipleEventListener(this.rootElement, EVENT_TYPES_FOR_ROOT_CAPTURE_FALSE, false)
         this.scm.destroy()
         //set current index attribute to focus the same index on cached pages
         this.rootElement.setAttribute(CURRENT_INDEX_ATTR, this.currentIndex);
         this.updateHighlighting(-1, false)
      },
      fireEvent: function(){
         //Only for preview
         /*var linkToOpen = this.getLinkToOpen()
         if(!linkToOpen){
            return
         }else{
            var win = DomUtils.getOwnerWindow(linkToOpen)
            var uiEvent = win.document.createEvent("UIEvents")
            uiEvent.initEvent(UIEvents.PREVIEW_LINK, true, true, win, null);
            linkToOpen.dispatchEvent(uiEvent)
         }*/
      },
      focusListView: function(){
         if(!this.focused){
            this.updateHighlighting(this.currentIndex, true)
         }
      },
      getCurrentItem: function(){
         return this.listItems[this.currentIndex]
      },
      getFirstIndex: function(){
         return 0
      },
      getLastIndex: function(){
         return this.listItems.length-1
      },
      getLinkToOpen: function(){
         var links = $(this.getCurrentItem()).find('a').andSelf().filter('a');
         if(links.length==0){
            return null
         }else if(links.length >= this.linkNoToOpen){
            return links[this.linkNoToOpen-1]
         }else{
            throw new Error("Link number to open exceeds number of available links within the item. Please correct ListView configuration.")
         }
      },
      handleFocusout: function(event){
         Utils.executeDelayed((new Date()).getTime(), 400, this.checkBlur, this, [event])
      },
      handleFocus: function(event){
         this.focusListView();
      },
      handleClick: function(event){
         var targetElement = event.target
         var element = DomUtils.getAncestorBy(targetElement, Utils.bind(function(parentNode){
            return (parentNode==this.rootElement || this.listItems.indexOf(parentNode)!=-1)?true:false
         }, this))
         if(element==null || element==this.rootElement)
            return
         this.updateHighlighting(this.listItems.indexOf(element), false)
         if(DomUtils.isEditableElement(targetElement)){
            //As focus will be on row change focus back to element 
            targetElement.focus()
         }
      },
      highlight: function(item, focusItem){
         this.currentItemWrapper = new ElementWrapper(item)
         this.currentItemWrapper.setCss(this.highlightCss)
         if(this.isTableRowTag(item)){
            this.currentTdTagWrappers = []
            var tds = item.getElementsByTagName('TD')
            for (var i = 0; i < tds.length; i++) {
               var elemWrapper = new ElementWrapper(tds[i])
               this.currentTdTagWrappers[i] = elemWrapper;
               elemWrapper.setStyle("background", "transparent", "important")
            }
         }
         this.currentItemWrapper.setProperty("tabIndex", 0);
         if(focusItem){
            item.focus()
         }
      },
      initShortcuts: function(){
         this.scm.addShortcut("Up", function(event){return this.moveUp(event, 1)}, this)
         this.scm.addShortcut("k", function(event){return this.moveUp(event, 1)}, this)
         this.scm.addShortcut("PAGE_UP", function(event){return this.moveUp(event, 10)}, this)
         this.scm.addShortcut("Down", function(event){return this.moveDown(event, 1)}, this)
         this.scm.addShortcut("j", function(event){return this.moveDown(event, 1)}, this)
         this.scm.addShortcut("PAGE_DOWN", function(event){return this.moveDown(event, 10)}, this)
         this.scm.addShortcut("Home", this.moveFirst, this)
         this.scm.addShortcut("End", this.moveLast, this)
         this.scm.addShortcut("Return", function(event){return this.openItemIn(event, this.defaultLinkTarget)}, this)
         this.scm.addShortcut("Ctrl+Return", function(event){
            return this.openItemIn(event, this.defaultLinkTarget==LinkTarget.CURRENT?LinkTarget.TAB:LinkTarget.CURRENT)
         }, this);
         this.scm.addShortcut("Space", this.toggleFirstCheckbox, this)
      },
      isItemElement: function(element){
         return this.listItems.indexOf(element)!=-1
      },
      isFirst: function(index){
         return index==this.getFirstIndex()
      },
      isLast: function(index){
         return index==this.getLastIndex()
      },
      isTableRowTag: function(item){
         return item.tagName=="TR"
      },
      moveDown: function(event, count){
         if(!this.isItemElement(event.target)){
            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
         }
//         if(DomUtils.isActiveElementEditable(this.rootElement.ownerDocument)){
//            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
//         }
         if(this.isLast(this.currentIndex))
            return
         if(this.currentIndex + count > this.getLastIndex()){
            this.moveLast();
         }else{
            this.updateHighlighting(this.currentIndex+count, true)
         }
      },
      moveFirst: function(event){
         if(event && !this.isItemElement(event.target)){
            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
         }
//         if(DomUtils.isActiveElementEditable(this.rootElement.ownerDocument)){
//            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
//         }
         if(this.isFirst(this.currentIndex))
            return
         this.updateHighlighting(this.getFirstIndex(), true)
      },
      moveLast: function(event){
         if(event && !this.isItemElement(event.target)){
            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
         }
//      
//         if(DomUtils.isActiveElementEditable(this.rootElement.ownerDocument)){
//            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
//         }
         if(this.isLast(this.currentIndex))
            return
         this.updateHighlighting(this.getLastIndex(), true)
      },
      moveUp: function(event, count){
         if(!this.isItemElement(event.target)){
            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
         }
//
//         if(DomUtils.isActiveElementEditable(this.rootElement.ownerDocument)){
//            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
//         }
         if(this.isFirst(this.currentIndex))
            return
         if(this.currentIndex - count < 0){
            this.moveFirst();
         }else{
            this.updateHighlighting(this.currentIndex - count, true)
         }
      },
      openItemIn: function(event, linkTarget){
         if(!this.isItemElement(event.target)){
            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
         }
         var ci = this.getCurrentItem()
         if(event.target != ci){//Focus is somewhere within the item
            return ShortcutManager.DO_NOT_SUPPRESS_KEY
         }
         var linkToOpen = this.getLinkToOpen()
         if(!linkToOpen){
         	click(ci);
            return
         }else {
            (new LinkWrapper(linkToOpen).open(linkTarget))
         }
      },
      toggleFirstCheckbox: function(event){
         if(!this.isItemElement(event.target)){
            return ShortcutManager.DO_NOT_SUPPRESS_KEY;
         }
         var ci = this.getCurrentItem()
         var firstCheckbox = XPathUtils.getElement(".//input[@type='checkbox']", ci)
         if(!firstCheckbox)
            return
         firstCheckbox.click(); //to also trigger other eventhandler
         this.updateHighlighting(this.currentIndex, false)
      },
      unhighlight: function(){
         if(this.currentItemWrapper){
            this.currentItemWrapper.restore()
         }
         if(this.currentTdTagWrappers){
            for (var i = 0; i < this.currentTdTagWrappers.length; i++) {
               this.currentTdTagWrappers[i].restore()
            }
         }
      },
      updateHighlighting: function(newIndex, focusItem){
         this.unhighlight()
         if(newIndex==-1){
            this.focused = false
            return
         }
         this.focused = true
         this.currentIndex = newIndex
         this.highlight(this.listItems[newIndex], focusItem);
         this.fireEvent();
      }
   };
   
   ObjectUtils.extend(ListViewHandler, AbstractGenericEventHandler);
   
})()