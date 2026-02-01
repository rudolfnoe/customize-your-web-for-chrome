import "/lib/custom/lang/Assert.js";
import "/lib/custom/lang/ArrayUtils.js";
import "/lib/custom/lang/Array.js";
import "/lib/custom/lang/ObjectUtils.js";
import "/lib/custom/lang/collections/ArrayList.js";
import "/lib/custom/lang/collections/Map.js";
import "/lib/custom/lang/ObjectUtils.js";
import "/background/UUIDGenerator.js";
import {Script} from "/datamodel/Script.js";
import "/datamodel/TargetWinDefinition.js";
import {CywConfig} from "/background/CywConfig.js";
import {OptionPageUtils} from "/optionpage/OptionPageUtils.js";


const MainController = {
   lastFocusedTabId: null,
   lastFocusedTabUrl: null,
   
   init: function(){
      chrome.runtime.onInstalled.addListener((details) => {
         console.log("OnInstall: " + details.reason);
         if (details.reason=='update' || details.reason=='install'){
            MainController.registerUserScriptController();   
         }
      });
      
      //Listener for commands
      chrome.commands.onCommand.addListener(function(command) {
         console.log('Command:', command);
         if (command == "open-configuration"){
            OptionPageUtils.openOptionsPage();
         }else if(command == "reload-extension"){
            chrome.runtime.reload();
         }
      });

      chrome.runtime.onMessage.addListener(function(message){
         //Reload Scripts from Storage
         CywConfig.init();
      })
      
      chrome.runtime.onUserScriptMessage.addListener(
         function(request, sender, sendResponse) {
            console.log(sender.tab ?
                        "from a content script:" + sender.tab.url :
                        "from the extension");
            let scriptsPromise = CywConfig.getActiveScriptsForUrl(request.url);
            scriptsPromise.then((scripts) => {
               var jsCode = "";
               scripts.forEach(function(script){
                  jsCode += "\n try{\n" 
                     + script.onloadJavaScript
                    + "} catch(e) {\n"
                    + "\tconsole.error('Error in Script " + script.name + " (" + script.uuid + "): ' + e.message);\n" 
                    + "}";
               });
               //console.log(jsCode);
               sendResponse({jsCode: jsCode});
            })
      });
   },
      
      
   getLastFocusedTabId: function(){
      return this.lastFocusedTabId;
   },
   
	getLastFocusedTabUrl: function(){
		return this.lastFocusedTabUrl;
	},

   registerUserScriptController: async function(){
      chrome.userScripts.configureWorld({
         csp: "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
         messaging: true
      });
      let userScripts = ["temp/loadstart.js",
			"lib/jquery/jquery-3.7.1.min.js",
			"lib/jquery-plugins/filter-extensions/filter-extensions.js",
			"lib/jquery-plugins/textcomplete/jquery.textcomplete.js",
			"lib/custom/lang/Assert.js",
			"lib/custom/lang/ObjectUtils.js",
			"lib/custom/lang/StringUtils.js",
			"lib/custom/lang/event/AbstractGenericEventHandler.js",
			"lib/custom/dom/DomUtils.js",
			"lib/custom/dom/CssUtils.js",
			"lib/custom/dom/LinkWrapper.js",
			"lib/custom/dom/ElementWrapper.js",
			"lib/custom/util/Utils.js",
			"lib/custom/ui/shortcuts/KeyCodeMapper.js",
			"lib/custom/ui/shortcuts/ShortcutCommands.js",
			"lib/custom/ui/shortcuts/AbstractShortcutManager.js",
			"lib/custom/ui/shortcuts/Shortcutmanager2.js",
			"lib/custom/ui/shortcuts/ShortStringManager.js",
			"api/api_helper.js",
			"api/enumerations.js",
			"api/shortcut.js",
			"api/focus.js",
			"api/click.js",
			"api/utils.js",
			"api/val.js",
			"api/list_view_handler.js",
			"api/listview.js",
         "userScript/UserScriptController.js",
			"temp/loadend.js"];
      let registeredScripts = []
      for (const script of userScripts){
         registeredScripts.push({file: script})
      }
      console.log(registeredScripts)
      await chrome.userScripts.register([{
         id: "CustomizeYourWeb",
         matches: ["*://*/*"],
         js: registeredScripts,
         allFrames: true,
         runAt: "document_end"
      }]);
      console.log('CYW: UserScript successfully installed')
   }
} 
MainController.init();