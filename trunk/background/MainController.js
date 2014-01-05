MainController = {
   lastFocusedTabId: null,
	
	init: function(){
		//chrome.webNavigation.onDOMContentLoaded.addListener(MainController.onDomContentLoaded.bind(this));
      //Listener for messages from content script
		chrome.runtime.onMessage.addListener(
				  function(request, sender, sendResponse) {
				    console.log(sender.tab ?
				                "from a content script:" + sender.tab.url :
				                "from the extension");
				    var scripts = CywConfig.getActiveScriptsForUrl(request.url);
				    var jsCode = "";
				    scripts.forEach(function(script){
				   	 jsCode += "\n try{\n" 
				   	 	+ script.onloadJavaScript
				   	   + "} catch(e) {\n"
				   	   + "\tconsole.error('Error in Script " + script.name + " (" + script.uuid + "): ' + e.message);\n" 
				   	   + "}";
				    });
				    console.log(jsCode);
				    sendResponse({jsCode: jsCode});
				  });

      //Listener for commands
      chrome.commands.onCommand.addListener(function(command) {
        
        console.log('Command:', command);
        var optionsUrl = chrome.extension.getURL('optionpage/options.html');

        var currentTabIndex = null;
        chrome.tabs.query({active: true}, function(tabs) {
            if (tabs.length) {
               MainController.lastFocusedTabId = tabs[0].id;
               currentTabIndex = tabs[0].index;
            }
        });
        
        chrome.tabs.query({url: optionsUrl}, function(tabs) {
            if (tabs.length) {
                 chrome.tabs.move(tabs[0].id, {index:currentTabIndex+1});
                 chrome.tabs.update(tabs[0].id, {active: true});
            } else {
                 chrome.tabs.create({url: optionsUrl, index:currentTabIndex+1});
            }
         }); 
      });
      
      console.log('CYW Main Controller set up.')
	},
   
   getLastFocusedTabId: function(){
      return this.lastFocusedTabId;
   }
   

} 
MainController.init();