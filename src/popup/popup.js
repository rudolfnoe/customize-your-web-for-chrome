/**
 * 
 */
import {CywConfig} from "../background/CywConfig.js";
import {OptionPageUtils} from "../optionpage/OptionPageUtils.js";

/**
 * 
 */
export const CywPopup = {
         backgroundPage: null,
         
         init: async function(){
            this.backgroundPage = await chrome.extension.getBackgroundPage();
            let tabs = await chrome.tabs.query({active: true})
            let scripts = await CywConfig.getActiveScriptsForUrl(tabs[0].url);
            console.log(scripts.length)
            scripts.forEach(function(script){
                  $('<tr>' +
                     '<td><a data-edit-id="' + script.uuid + '" href="#">' + script.name + '</a></td>' +
                  '</tr>')
                  .appendTo('#scripts');
            });
            $('<tr>' +
                  '<td><b><a data-edit-id="" href="#">New script</a></b></td>' +
               '</tr>')
               .appendTo('#scripts');

            listview('#scripts', 'tr', {highlightCss:'background-color:#f5f5f5'});
            
            $('a[data-edit-id]').on('click', CywPopup.openScript);
               
         },
         
         openScript: async function(e){
            let scriptId = $(e.target).attr('data-edit-id');
            OptionPageUtils.openOptionsPage(scriptId);
            window.close();
         }
}
$(document).ready(function(){
   console.log('init popup')
   CywPopup.init();
})
