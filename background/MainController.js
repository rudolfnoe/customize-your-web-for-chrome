MainController = {
	
	init: function(){
		chrome.webNavigation.onDOMContentLoaded.addListener(MainController.onDomContentLoaded.bind(this));
	},
   
   onDomContentLoaded: function(details){
      if(details.frameId!=0)
         return;
      console.log(details.url);
      var scripts = CywConfig.getActiveScriptsForUrl(details.url);
   }
} 
MainController.init();