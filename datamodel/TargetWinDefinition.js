const URL_DOMAIN_PART_REG_EXP = /^\w{1,}:\/\/(\w|\.){1,}/;

function TargetWinDefinition(includeUrlPatternString, excludeUrlPatternString){
   this.includeUrlPatternString = includeUrlPatternString;
   this.includeUrlPatternsRegExp = [];
   this.excludeUrlPatternString = excludeUrlPatternString;
   this.excludeUrlPatternsRegExp = [];
   this.updateUrlPatternRegExp();
}

TargetWinDefinition.createFromJson = function(jsonObj){
   var newTargetWinDefintion = $.extend((new TargetWinDefinition()), jsonOjb);
   newTargetWinDefintion.updateUrlPatternRegExp();
   return newTargetWinDefintion;
}

TargetWinDefinition.prototype = {
   constructor: TargetWinDefinition,
   
   getMatchingWindows: function(win){
      var matchingWins = new Array()   
      DomUtils.iterateWindows(win, function(subWin){
         if(!this.matchUrl(subWin.location.href))
            return
         matchingWins.push(subWin)
      }, this)
      return matchingWins
   },
   
   getUrlPatternDescription: function(){
      if(this.includeUrlPatterns.size()==0)
         return ""
      return this.includeUrlPatterns.get(0).getString()
   },
   
   hasIncludePattern: function(){
      return this.includeUrlPatterns.length>0
   },
   
   matchesWinOrSubwin: function(win){
      return this.getMatchingWindows(win).length > 0   
   },
   
   iterateMatchingWins: function(win, callbackFct, thisObj){
      var matchingWins = this.getMatchingWindows(win)
      for (var i = 0; i < matchingWins.length; i++) {
         callbackFct.apply(thisObj, [matchingWins[i]])
      }
   },
   
   //Returns true if the domain part of one of the inclucde url patterns exacly match the
   //domain part of the provided url
   //TODO
   matchDomain: function(url){
      Assert.paramsNotNull(arguments)
      var targetDomainRegExpResult = url.match(URL_DOMAIN_PART_REG_EXP)
      if(targetDomainRegExpResult==null){
         return false
      }
      var targetDomain = targetDomainRegExpResult[0]
      
      var includePatternStrings = this.getIncludeUrlPatternStrings()
      for (var i = 0;i < includePatternStrings.length; i++) {
         var includeUrlPatternString = includePatternStrings[i]
         var domainPartIncludeUrlPattern = includeUrlPatternString.match(URL_DOMAIN_PART_REG_EXP)
         if(domainPartIncludeUrlPattern!=null && targetDomain == domainPartIncludeUrlPattern[0]){
            return true
         }
      }
      return false
   },

   matchUrl: function(url){
      var matchInclude = false;
      for (var i = 0;i < this.includeUrlPatternsRegExp.length; i++) {
         if(this.includeUrlPatternsRegExp[i].test(url)){
            matchInclude = true
            break;
         }
      }
      if(!matchInclude)
         return false;
         
      for (var i = 0;i < this.excludeUrlPatternsRegExp.length; i++) {
         if(this.excludeUrlPatternsRegExp[i].test(url)){
            return false;
         }
      }
      return true;
   },

   updateUrlPatternRegExp: function(){
      var self = this;
      this.excludeUrlPatternsRegExp = []
      if (this.excludeUrlPatternString){
         var excludeUrlPatternArry = this.excludeUrlPatternString.split('\n');
         excludeUrlPatternArry.forEach(function(item){
            self.excludeUrlPatternsRegExp.push(UrlUtils.convertUrlPatternToRegExp(item));
         });
      }
      this.includeUrlPatternsRegExp = []
      if (this.includeUrlPatternString){
         var includeUrlPatternArry = this.includeUrlPatternString.split('\n');
         includeUrlPatternArry.forEach(function(item){
            self.includeUrlPatternsRegExp.push(UrlUtils.convertUrlPatternToRegExp(item));
         });
      }
   }
      
};