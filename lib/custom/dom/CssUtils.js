(function(){
   var CssUtils = {
      applyCssStyle: function(element, cssText, overwriteExisiting){
         if(!element || element.nodeType!=1)
            throw new Error('element must be provieded')
         if(overwriteExisiting){
            element.cssText=cssText
            return
         }else{
            var cssObj = this.parseCssText(cssText)
            var style = element.style 
            for(var m in cssObj){
               element.style[m] = cssObj[m]
            }
         }
      },
      convertCssPropNameToCamelCase: function(cssPropName){
         var parts = cssPropName.split("-")
         var result = parts[0]=="moz"?"Moz":parts[0] 
         for (var i = 1; i < parts.length; i++) {
            result += StringUtils.firstUpper(parts[i])
         }
         return result
      },
      
      hideElement: function(element){
         this._showHideElement(element, false)
      },
      
      /*
       * Determines if the provided property name is a style property
       */
      isStyleProperty: function(cssPropName){
         var pseudoStyle = window.getComputedStyle(document.documentElement, null)
         if(StringUtils.contains("-", cssPropName)){
            cssPropName = this.convertCssPropNameToCamelCase(cssPropName)
         }
         return pseudoStyle[cssPropName]!=undefined
      },
      
      parseCssText: function(cssText){
         var result = new Object()
         if(StringUtils.isEmpty(cssText))
            return result
         var cssParts = cssText.split(';')
         for (var i = 0; i < cssParts.length; i++) {
            var part = StringUtils.removeWhitespace(cssParts[i])
            if(StringUtils.isEmpty(part))
               continue
            var partSplit = part.split(":")
            if(partSplit.length!=2)
               throw new Error('invalid cssText')
            result[partSplit[0]] = partSplit[1]
         }
         return result
      },
      
      showElement: function(element){
         this._showHideElement(element, true)
      },

      _showHideElement: function(element, show){
         if(!element)
            throw new Error ('NullPointerException')
         if(element.nodeType!=1)
            throw new Error ('param must be element')
         if(show)
            element.style.visibility = "visible"
         else
            element.style.visibility = "collapse"
      }
   }

   this.CssUtils = CssUtils;
})()