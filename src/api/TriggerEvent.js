function Click(jQuerySelector){
   var elem = $(jQuerySelector).get(0);
   if (elem && elem.click){
      elem.click();
   }
}
