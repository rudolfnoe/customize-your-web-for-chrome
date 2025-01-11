import {TargetWinDefinition} from "./TargetWinDefinition.js";

export function Script(){
	this.uuid = null;
	this.name = null;
	this.targetWinDefinition = new TargetWinDefinition();
	this.onloadJavaScript = null;
	this.disabled = false;
}

Script.createFromJson = function(jsonObj){
   let newScript = new Script();
   newScript.uuid = jsonObj.uuid;
   newScript.name = jsonObj.name;
   newScript.onloadJavaScript = jsonObj.onloadJavaScript;
   newScript.disabled = jsonObj.disabled;
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
   
   setUrlPatternString: function(urlPatternString){
      this.targetWinDefinition = new TargetWinDefinition(urlPatternString);
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