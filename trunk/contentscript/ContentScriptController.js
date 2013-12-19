ContentScriptController = {
	jsCodeToInject: "",
   
   injectScript: function(){
   	chrome.runtime.sendMessage({url: window.location.href}, function(response) {
   		var jsCode = response.jsCode;
   		console.log(response.jsCode);
 	   	$('body').append('<script>' + response.jsCode + '</script>');
   	});
      shortcut("ESCAPE", function(){
         if (document.activeElement.blur){
            document.activeElement.blur();
         }
      });
   }
} 
ContentScriptController.injectScript();