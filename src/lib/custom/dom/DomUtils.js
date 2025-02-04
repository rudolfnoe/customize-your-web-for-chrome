with(this){
(function() {
   var DomUtils = {
      
      //Taken from firebug, see firebug-license.txt
      addStyleSheet : function(doc, link) {
         var heads = doc.getElementsByTagName("head");
         if (heads.length)
            heads[0].appendChild(link);
         else
            doc.documentElement.appendChild(link);
      },
      
      appendElement: function(parent, tagName){
         var doc = parent.ownerDocument
         var newElement = doc.createElement(tagName)
         return parent.appendChild(newElement)
      },
      
      assureStyleSheet: function(doc, url){
         var styleSheets = doc.styleSheets
         var included = false
         for (var i = 0; i < styleSheets.length; i++) {
            if(styleSheets[i].href==url){
               included = true
               break;
            }
         }
         if(included){
            return;
         }
         var link = this.createStyleSheet(doc, url);
         this.addStyleSheet(doc, link);
      },
      
      blurActiveElement: function(win){
         Assert.paramsNotNull(arguments)
         var activeElement = this.getActiveElement(win)
         if(!activeElement)
            return
         if(activeElement.blur){       
            activeElement.blur()
         }
         if(activeElement.ownerDocument.designMode=="on"){
            activeElement.ownerDocument.defaultView.top.focus()
         }
      },
      
      containsFrames: function(win){
      	return win.frames.length>0
      },
      
      convertNodeListToArray: function(nodeList){
         Assert.paramsNotNull(arguments)
         return ArrayUtils.cloneArray(nodeList)
      },
      
      //Taken from firebug, see firebug-license.txt
      createStyleSheet : function(doc, url) {
         var link = doc.createElementNS("http://www.w3.org/1999/xhtml", "link");
         link.setAttribute("charset", "utf-8");
         link.firebugIgnore = true;
         link.setAttribute("rel", "stylesheet");
         link.setAttribute("type", "text/css");
         link.setAttribute("href", url);
         return link;
      },
      
      getActiveElement: function(win){
         var activeElement = win.document.activeElement
         if(!activeElement){
            return null
         }
         while(activeElement.tagName && (activeElement.tagName =="FRAME" || activeElement.tagName=="IFRAME")){
            activeElement = activeElement.contentDocument.activeElement
         }
         return activeElement
      },
      
      getAncestorBy: function(element, testFunction){
         while(element = element.parentNode){
            if(testFunction(element)){
               return element
            }
         }
         return null
      },
      
      getAttribute: function(element, attr, defaultValue){
         if(element.hasAttribute(attr)){
            return element.getAttribute(attr)
         }else{
            return defaultValue
         }
      },
      
      //Taken from firebug and modified, see firebug-license.txt
      getBody : function(doc) {
         if (doc.body)
            return doc.body;
         var bodyElems = doc.getElementsByTagName("body")
         return bodyElems.length>0?bodyElems[0]:null
      },
      
      getChildrenBy: function(element, testFunction, testOnlyElementChilds){
         var result = new Array()
         var childNodes = element.childNodes
         for (var i = 0; i < childNodes.length; i++) {
            if(testOnlyElementChilds && childNodes[i].nodeType!=1)
               continue;
            if(testFunction(childNodes[i]))
               result.push(childNodes[i])
         }
         return result
      },
      
      getElement: function(elementOrId){
         if(typeof elementOrId == "string"){
            return document.getElementById(elementOrId)
         }else{
            return elementOrId
         }
      },
      
      getElements: function(elementOrIdArray){
         var resultArray = []
         if(elementOrIdArray){
            for (var i = 0; i < elementOrIdArray.length; i++) {
               resultArray.push(this.getElement(elementOrIdArray[i]))
            }
         }
         return resultArray
      },
      
      getElementChildren: function(element){
         return this.getChildrenBy(element, function(){return true}, true)
      }, 
      
      getElementByAnonId: function(xblElement, anonid){
         return document.getAnonymousElementByAttribute(xblElement, "anonid", anonid)
      },
      
      getElementType: function(element){
         if(!element || !element.tagName)
               return null;
         var tagName = element.tagName
         var type = element.type?element.type.toLowerCase():""

         if(tagName == "INPUT"){
            if(type=="text")
               return HtmlElementType.TEXT
            else if(type=="password")
               return HtmlElementType.PASSWORD
            else if(type=="radio")
               return HtmlElementType.RADIO
            else if(type=="checkbox")
               return HtmlElementType.CHECKBOX
            else if(type=="file")
               return HtmlElementType.FILE
         }else if(tagName == "SELECT")
            return HtmlElementType.SELECT
         else if(tagName == "TEXTAREA")
            return HtmlElementType.TEXTAREA
         else if(tagName == "BUTTON" || 
            (tagName == "INPUT" && ( type == "button" || type == "submit" || type == "reset" || type == "image"))){
            return HtmlElementType.BUTTON
         } else {
            return HtmlElementType.OTHER
         }
      },
      
      getElementsByAttribute: function(docOrElement, attr, value){
         var xPathExp = ""
         if(docOrElement instanceof Element){
            xPathExp += "."
         }
         xPathExp += "//*[@" + attr
         if(arguments.length>=3 && value!="*"){
            xPathExp += "='" + value + "']"
         }else{
            xPathExp += "]"
         }
         return XPathUtils.getElements(xPathExp, docOrElement)   
      },
      
      getElementsByTagNameAndAttribute: function(root, tagName, attr, value){
          var elems = root.getElementsByTagName(tagName)
          var result = new Array()
          for (var i = 0; i < elems.length; i++) {
            if(elems[i].hasAttribute(attr) &&
               (elems[i].getAttribute(attr)==value || value=="*")){
               result.push(elems[i])
            }
          }
          return result
      },
      
      getFirstChildBy: function(element, testFunction, testOnlyElementChilds){
         if(!element.hasChildNodes())
            return null
         var children = element.childNodes
         for (var i = 0; i < children.length; i++) {
            if(testOnlyElementChilds && children[i].nodeType!=1)
               continue;
            if(testFunction(children[i]))
               return children[i]
         }
         return null;
      },
      
      getFirstChildByTagName: function(element, tagName){
         element = element?element:document.documentElement
         var testFunction = null
         if(!tagName || tagName=="*")
            testFunction = function(){return true;}
         else
            testFunction = function(childNode){childNode.tagName.toUpperCase()==tagName.toUpperCase();
         }
         return this.getFirstChildBy(element, testFunction, true)
      },
      
      getFirstDescendantByTagName: function(element, tagName){
         element = element?element:document.documentElement
         var descendants = element.getElementsByTagName(tagName)
         if(descendants.length==0)
            return null
         else
            return descendants[0]
      },
      
      getFrameByName: function(win, name){
      	var result = null
      	this.iterateWindows(win, function(subWin){
      	  if(subWin.name == name)
      	     result = subWin
      	})
      	return result
      },
      
      getFrameByLocationHref: function(win, href){
         var result = null
         this.iterateWindows(win, function(subWin){
           if(subWin.location.href == href)
              result = subWin
         })
         return result
      },

      getFrameByHrefRegExp: function(win, hrefRegExp){
         var result = new Array()
         this.iterateWindows(win, function(subWin){
           if(hrefRegExp.test(subWin.location.href))
              result.push(subWin)
         })
         return result
      },

      getNextElementSibling: function(element, onlyVisible){
         var node = element.nextSibling 
         while(node){
            if(node.nodeType==1 && (!onlyVisible || DomUtils.isVisible(node))){
               return node
            }
            node = node.nextSibling;
         }
         return null
      },
      
      /*
       * @param element: element for which offset should be computed @param
       * @returns Object: values y x
       */
      getOffsetToBody : function(element) {
         var offset = {}
         offset.y = element.offsetTop
         offset.x = element.offsetLeft
         while (element.offsetParent != null) {
            element = element.offsetParent
            offset.y += element.offsetTop;
            offset.x += element.offsetLeft
         }
         return offset
      },
      
      /*
       * Returns
       */
      getOffsetToViewport: function(element){
         var offsetToBody = this.getOffsetToBody(element)
         var win = element.ownerDocument.defaultView
         offset = {}
         offset.y = offsetToBody.y - win.scrollY
         offset.x = offsetToBody.x - win.scrollX
         return offset
      },
      
      getOwnerWindow: function(element){
      	return element.ownerDocument.defaultView
      },
      
      getPreviousElementSibling: function(element, onlyVisible){
         var node = element.previousSibling 
         while(node){
            if(node.nodeType==1 && (!onlyVisible || DomUtils.isVisible(node))){
               return node
            }
            node = node.previousSibling;
         }
         return null
      },
      
      insertAsFirstChild: function(newElement, parent){
         Assert.paramsNotNull(arguments)
         if(parent.hasChildNodes()){
            parent.insertBefore(newElement, parent.firstChild)
         }else{
            parent.appendChild(newElement)
         }
      },
      
      insertAfter: function(newElement, refElement){
         Assert.paramsNotNull(arguments)
         var parent = refElement.parentNode
         if(refElement.nextSibling!=null){
            parent.insertBefore(newElement, refElement.nextSibling)
         }else{
            parent.appendChild(newElement)
         }
      },
      
      insertBefore: function(newElement, refElement){
         Assert.paramsNotNull(arguments);
         refElement.parentNode.insertBefore(newElement, refElement)
      },
      
      isActiveElementEditable: function(document){
         return this.isEditableElement(document.activeElement);
      },
      
      isEditableElement: function(element){
               if(element==null || element.nodeType!=1)
                   return false;
               var tagName = element.tagName.toUpperCase();
               var type = element.type?element.type.toLowerCase():"";
               var isEditableElement = ( ((tagName == "INPUT" && (type=="text")) ||
                                           tagName == "TEXTAREA" ||
                                           tagName == "SELECT")
                                           && !element.readonly ) ||
                                         (element.ownerDocument &&
                                          element.ownerDocument.designMode=="on") ||
										  element.isContentEditable ||
                                          element.ownerDocument.body.isContentEditable ||
                                         //For performance reasons this comes at the end
                                         ( (tagName == "INPUT") &&
                                           (type=="password" || type=="date" ||
                                            type=="email" || type=="datetime" ||
                                            type=="number" || type=="search" ||
                                            type=="tel" || type=="time" ||
                                            type=="url" || type=="week") &&
                                           !element.readonly
                                   );
         return isEditableElement;
      },      
      isChildOf: function(parentElem, childElem){
         if(parentElem == null || childElem == null){
            return false
         }
         var childNodes = parentElem.childNodes
         for (var i = 0; i < childNodes.length; i++) {
            if(childNodes.item(i)==childElem){
               return true
            }
         }
         return false
      },
      
      isEditableIFrame: function(element){
         if(!element){
            return false
         }
         return element.localName.toLowerCase()=="iframe" && element.contentDocument.designMode=="on"
      },

      isFramesetWindow: function(win){
         if(win.document.getElementsByTagName('frameset').length>0)
            return true
         else
            return false
      },
      
      isVisible: function(element){
         if(!element.ownerDocument)
            return false
         var win = element.ownerDocument.defaultView
         var style = win.getComputedStyle(element, "")
         return style.display!="none" && style.visibility!="hidden" && style.visibility!="collapse"
      },
      
      iterateDescendantsByTagName: function(element, descendantTagName, funcPointer){
      	var descendants = element.getElementsByTagName(descendantTagName)
      	for (var i = 0; i < descendants.length; i++) {
      		funcPointer(descendants[i])
      	}
      },
      
      // Taken and modified from firebug, see firebug-license.txt
      iterateWindows : function(win, handler, thisObj) {
         if (!win || !win.document)
            return;

         ObjectUtils.callFunction(handler, thisObj, [win])

         if (win == top)
            return; // XXXjjb hack for chromeBug

         for (var i = 0; i < win.frames.length; ++i) {
            var subWin = win.frames[i];
            if (subWin != win)
               this.iterateWindows(subWin, handler, thisObj);
         }
      },
      
      moveTo: function(elt, x, y){
         elt.style.left = x + "px";
         elt.style.top = y + "px";
      },
      
      //Taken from firebug, see firebug-license.txt
      ownerDocIsFrameset: function(elt){
         var body = this.getBody(elt.ownerDocument);
         if(body==null)
            return false
         return body.localName.toUpperCase() == "FRAMESET"
      },
      
      removeElement: function(element){
         var parentNode = element.parentNode
         if(!parentNode)
            return false
         return parentNode.removeChild(element) 
      },
      
      resizeTo: function(elt, w, h){
         elt.style.width = w + "px";
         elt.style.height = h + "px";
      }
   };
   this["DomUtils"] = DomUtils;
   
   var HtmlElementType = {
      BUTTON: "BUTTON",
      CHECKBOX: "CHECKBOX",
      FIELDSET: "FIELDSET",
      FILE: "FILE",
      IFRAME: "IFRAME",
      OTHER: "OTHER",
      PASSWORD: "PASSWORD",
      RADIO: "RADIO",
      SELECT: "SELECT",
      TEXT: "TEXT",
      TEXTAREA: "TEXTAREA"
   };
   this["HtmlElementType"] = HtmlElementType
      
}).apply(this)
}