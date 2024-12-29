ContentScriptController = {
	jsCodeToInject: "",
   
   injectScript: function(){
   	chrome.runtime.sendMessage({url: window.location.href}, function(response) {
   		var jsCode = response.jsCode;
   		console.log(response.jsCode);
 	   	//$('body').append('<script>' + response.jsCode + '</script>');
   		window.eval(response.jsCode);
   	});
      shortcut("ESCAPE", function(){
         if (document.activeElement.blur){
            document.activeElement.blur();
         }
      });
      //Zum testen von shortcut
      /*shortcut("left", function(){
      	alert('*');
      });*/
   }
} 
ContentScriptController.injectScript();