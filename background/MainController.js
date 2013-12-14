MainController = {
	
	init: function(){
		//chrome.webNavigation.onDOMContentLoaded.addListener(MainController.onDomContentLoaded.bind(this));
		chrome.runtime.onMessage.addListener(
				  function(request, sender, sendResponse) {
				    console.log(sender.tab ?
				                "from a content script:" + sender.tab.url :
				                "from the extension");
				    var scripts = CywConfig.getActiveScriptsForUrl(request.url);
				    var jsCode = "";
				    scripts.forEach(function(script){
				   	 jsCode += "\n" + script.onloadJavaScript;
				    });
				    sendResponse({jsCode: jsCode});
				  });		
	},
   
   onDomContentLoaded: function(details){
      if(details.frameId!=0)
         return;
      console.log(details.url);
      var scripts = CywConfig.getActiveScriptsForUrl(details.url);
   }
} 
MainController.init();