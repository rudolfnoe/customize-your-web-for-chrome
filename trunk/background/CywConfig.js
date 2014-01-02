CywConfig = {
   
   //Flag indicating wether performance log is activated
   perfLogActive: false,
   scripts: [],
   //To detect from where observer notifcation comse from
   id: (new Date()).getTime(),
   
   
   cloneScript: function(script){
      return ObjectUtils.deepClone(script)
   },
   
   deleteScript: function(scriptUuid){
   	var found = false;
   	for(var i=0; i<this.scripts.length;i++){
   		if(this.scripts[i].uuid==scriptUuid){
   			this.scripts = this.scripts.removeAtIndex(i);
   			var found = true;
            break;
   		}
   	};
   	if(!found){
   		alert('Script to delete could not be found');
   	}else{
   		this.saveScripts();
   	}
   },
   /* 
    * Return Array of scripts matching the provied url
    */
   getActiveScriptsForUrl: function(url){
      var result = new Array()
      for (var i = 0; i < this.scripts.length; i++) {
         var script = this.scripts[i]
         if(script.matchUrl(url) && !script.isDisabled()){
            result.push(script);
         }
      }
      return result
   },
   
   
   //Checks wether script with given guiId already exists
   getScriptByUUIId: function(uuid){
      for (var i = 0; i < this.scripts.length; i++) {
         var script = this.scripts[i]
         if(script.uuid==uuid){
            return script
         }
      }
      return null
   },
   
   /*Returns array of cloned scripts which "matches" at least one url of 
    * the target win and it frames. Matches includes both matching the URL pattern or having the same domain
    */
   getScriptsForEditing: function(targetWin){
      //assemble all urls
      var urls = []
      DomUtils.iterateWindows(targetWin, function(subWin){urls.push(subWin.location.href)})
      
      var matchingScripts = new Set()
      var containsCompareFct = function(objSearched, elementFromList){
         return objSearched.getId() == elementFromList.getId();
      }
      for (var scriptIndex = 0; scriptIndex < this.scripts.length; scriptIndex++) {
         for (var urlIndex = 0; urlIndex < urls.length; urlIndex++) {
            var script = this.scripts.get(scriptIndex)
             
            if((script.matchUrl(urls[urlIndex]) || script.matchDomain(urls[urlIndex]))&&
               //checking in condition only to avoid unneccessary cloning of scripts
               !matchingScripts.contains(script, containsCompareFct)){   
               matchingScripts.add(this.cloneScript(script)) 
            }
         }
      }
      return matchingScripts
   },
   
   getScripts: function(){
   	return this.scripts;
   },
   
   init: function(){
   	var self = this;
   	console.log('CywConfig.init');
      chrome.storage.local.get('scripts', function(storageObj){
         self.scripts = []
         for(var i=0; i<storageObj.scripts.length; i++){
            self.scripts.push(Script.createFromJson(storageObj.scripts[i]));
         }
   		console.log('CYW Scripts count: '+ self.scripts.length);
   	});
   },
   
   saveScript: function(aScript){
   	if(aScript.uuid == null || aScript.uuid.length == 0){
   		aScript.uuid = UUIDGenerator.randomUUID();
   		this.scripts.push(aScript);
   	}else{
   		for(var i=0; i<this.scripts.length;i++){
   			var oldScript = this.scripts[i];
   			if (oldScript.uuid == aScript.uuid){
   				this.scripts[i] = aScript;
               break;
   			}
   		}
   	}
   	this.saveScripts();
      //Return updated Script
      return aScript;
   },
   
   saveScripts: function(){
   	chrome.storage.local.set({'scripts': this.scripts}, function() {
     	    // Notify that we saved.
     	    console.log('CYW: Scripts successfully saved');
   	});   
   }
   
  
};
   
  
CywConfig.init();