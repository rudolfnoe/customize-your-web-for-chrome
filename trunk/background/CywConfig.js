CywConfig = {
   //Flag indicating wether performance log is activated
   perfLogActive: false,
   scripts: new ArrayList(),
   //To detect from where observer notifcation comse from
   id: (new Date()).getTime(),
   
   
   cloneScript: function(script){
      return ObjectUtils.deepClone(script)
   },
   
   deleteScript: function(scriptUuid){
   	var found = false;
   	for(var i=0; i<this.scripts.size();i++){
   		if(this.scripts.get(i).uuid==scriptUuid){
   			this.scripts.removeAtIndex(i);
   			var found = true;
   		}
   	};
   	if(!found){
   		alert('Script to delete could not be found');
   	}else{
   		this.saveScripts();
   	}
   },
   /* 
    * Return arraylist of scripts matching the provied url
    */
   getActiveScriptsForUrl: function(url){
      var scripts = this.getScripts()
      var result = new Array()
      for (var i = 0; i < scripts.size(); i++) {
         var script = scripts.get(i)
         if(script.matchUrl(url) && !script.isDisabled()){
            result.push(this.cloneScript(script))
         }
      }
      return result
   },
   
   
   //Checks wether script with given guiId already exists
   getScriptByUUIId: function(uuid){
      for (var i = 0; i < this.scripts.size(); i++) {
         var script = this.scripts.get(i)
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
      for (var scriptIndex = 0; scriptIndex < this.scripts.size(); scriptIndex++) {
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
   		self.scripts = new ArrayList(storageObj.scripts);
   		console.log('Scripts count: '+ self.scripts.size());
   	});
   },
   
   saveScript: function(aScript){
   	if(aScript.uuid == null || aScript.uuid.length == 0){
   		aScript.uuid = UUIDGenerator.randomUUID();
   		this.scripts.add(aScript);
   	}else{
   		for(var i=0; i<this.scripts.size();i++){
   			var oldScript = this.scripts.get(i);
   			if (oldScript.uuid == aScript.uuid){
   				this.scripts.replace(aScript, oldScript);
   			}
   		}
   	}
   	this.saveScripts();   
   },
   
   saveScripts: function(){
   	chrome.storage.local.set({'scripts': this.scripts.toArray()}, function() {
  	    // Notify that we saved.
  	    console.log('Scripts successfully saved');
  	});   

   }
   
};
   
  
CywConfig.init();