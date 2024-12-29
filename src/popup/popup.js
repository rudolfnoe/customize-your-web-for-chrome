/**
 * 
 */
(function(){
   Popup = {
         backgroundPage: chrome.extension.getBackgroundPage(),
         
         init:function(){
            chrome.tabs.query({active: true}, function(tabs) {
               scripts = Popup.backgroundPage.CywConfig.getActiveScriptsForUrl(tabs[0].url);
               console.log(scripts.length)
               scripts.forEach(function(script){
                     $('<tr>' +
                        '<td><a data-edit-uuid="' + script.uuid + '" href="#">' + script.name + '</a></td>' +
                     '</tr>')
                     .appendTo('#scripts');
               });
               $('<tr>' +
                     '<td><b><a data-edit-uuid="" href="#">New script</a></b></td>' +
                  '</tr>')
                  .appendTo('#scripts');

               listview('#scripts', 'tr', {highlightCss:'background-color:#f5f5f5'});
               
               $('a[data-edit-uuid]').on('click', Popup.openScript);
               
            });
         },
         
         openScript: function(e){
            //console.log($(e.target).attr('data-edit-uuid');
            Popup.backgroundPage.MainController.openOptionsPage($(e.target).attr('data-edit-uuid'));
            window.close();
         }
   }
   $(document).ready(Popup.init);
})()