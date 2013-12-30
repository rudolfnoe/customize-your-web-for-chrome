function Script(){
	this.uuid = null;
	this.name = null;
	this.targetWinDefinition = new TargetWinDefinition();
	this.onloadJavaScript = null;
	this.disabled = false;
}

Script.createFromJson = function(jsonObj){
   var newScript = $.extend((new Script()), jsonObj);
   newScript.targetWinDefinition = TargetWinDefinition.createFromJson(jsonObj.targetWinDefinition)
   return newScript;
};

Script.prototype = {
   isDisabled: function(){
      return this.disabled;
   },
   
   setDisabled: function(disabled){
      this.disabled = disabled;
   },

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
 
   getUrlPatternString: function(){
      return this.targetWinDefinition.getUrlPatternString();
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