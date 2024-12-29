(function(){
   function LinkWrapper(link){
      this.link = link      
   }
   
   LinkWrapper.prototype = {
      constructor: LinkWrapper,
      open: function(where){
         if(where == LinkTarget.CURRENT){
            var clickEvent = new MouseEvent("click")
            this.link.dispatchEvent(clickEvent)
         }else if (where == LinkTarget.TAB){
            $(this.link).attr('target','_blank')
               .get(0).click();
            $(this.link).removeAttr('target');
         }else{
            console.log('Open in new window not yet implemented')
         }
      }
   }

   this.LinkWrapper = LinkWrapper;
   
})()