(function(){
   var defaultSettings = {
      "pos": null
   }
   val = function(selector, value, opts){
   	Assert.notNull(selector);
   	Assert.notNull(value);
   	
   	var settings = $.extend(defaultSettings, opts);
   	
   	var $targetElements = $(selector);
   	//Setting multiple Elements via jquery
   	if (!settings.pos && $targetElements.length>1){
   		$targetElements.val(value);
   		return;
   	} else if ($targetElements.length==0){
   		console.warn('CYW val-function: No target found for selector "' + selector + '"');
   		return;
   	}
   	
   	//determine type of single element
   	var targetElementTagName = $targetElements.get(0).tagName.toLowerCase();
   	var type = $targetElements.attr('type');
   	
   	if ((targetElementTagName == 'input' && (!type || type.toLowerCase()=='text' || type.toLowerCase()=='password'))
   			|| targetElementTagName == 'textarea'){
   		$targetElements.val(value);
   	} else if (targetElementTagName == 'select'){
   		//Interate option values
   		$targetElements.find('option').each(function(){
   			$option = $(this);
   			var optionVal = $option.val();
   			if( (optionVal == value) || 
   				 (optionVal && optionVal.toLowerCase() == value.toLowerCase()) ){
   				$option.prop('selected', 'true');
   				return;
   			}
   		});
   		
   		//Interate option labels
   		$targetElements.find('option').each(function(){
   			$option = $(this);
   			var optionLabel = $option.text();
   			if( (optionLabel == value) || 
     				 (optionLabel && optionLabel.toLowerCase() == value.toLowerCase()) ){
     				$option.prop('selected', 'true');
     				return;
     			}
   		});
   		console.warn('CYW val-function: No entry found in selectbox for selector "' + selector + '" with value "' + value + '"');
   	} else {
   		console.warn('CYW val-function: Tagname ' + targetElementTagName + ' for selector ' + selector + ' not supported');
   	}
   };

   
   
})()
