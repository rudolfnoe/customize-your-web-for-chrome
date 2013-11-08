function Script(){
	this.uuid = null;
	this.name = null;
	this.targetWinDefinition = new TargetWinDefinition();
	this.onloadJavaScript = null;
}

Script.createFromJson = function(jsonObj){
   var newScript = $.extend((new Script()), jsonObj);
   newScript.targetWinDefinition = TargetWinDefinition.createFromJson(jsonObj.targetWinDefinition)
   return newScript;
};

Script.prototype = {
   getName: function(){
      return this.name;
   },
   
   setName: function(name){
      this.name = name;
   },
   
   getOnloadJavaScript: function(){
      return this.onloadJavaScript;
   },
   
   setOnloadJavaScript: function(scriptCode){
      this.onloadJavaScript = scriptCode;
   },
   
   getExcludeUrlPatternString: function(){
      return this.targetWinDefinition.excludeUrlPatternString;
   },
 
   getIncludeUrlPatternString: function(){
      return this.targetWinDefinition.includeUrlPatternString;
   },
   
   setUrlPatterns: function(includeUrlPatternString, excludeUrlPatternString){
      this.targetWinDefinition = new TargetWinDefinition(includeUrlPatternString, excludeUrlPatternString);
   },
   
   getUuid: function(){
      return this.uuid; 
   },

   setUuid: function(uuid){
      this.uuid = uuid; 
   },
   
   matchUrl: function(url){
      return this.targetWinDefinition.matchUrl(url)
   }
   
}