export const OptionPageUtils = {

    openOptionsPage: async function(scriptId){
        let currentTabIndex = null;
        let lastFocusedTabId = null;
        let lastFocusedTabUrl = null;
        let tabs = await chrome.tabs.query({active: true});
        if (tabs?.length) {
              lastFocusedTabId = tabs[0].id;
              lastFocusedTabUrl = tabs[0].url
              currentTabIndex = tabs[0].index;
        }
  
        var optionsUrl = new URL(chrome.runtime.getURL('optionpage/options.html'));
        tabs = await chrome.tabs.query({url: optionsUrl + '*'});
        optionsUrl.searchParams.append('scriptId',(scriptId?scriptId:'new'));
        optionsUrl.searchParams.append('lastFocusedTabId',lastFocusedTabId);
        optionsUrl.searchParams.append('lastFocusedTabUrl',lastFocusedTabUrl);
  
        if (tabs.length) {
              var optionTabId = tabs[0].id
              chrome.tabs.move(optionTabId, {index:currentTabIndex+1});
              chrome.tabs.update(optionTabId, {url:optionsUrl.toString(), active: true});
        } else {
              chrome.tabs.create({url: optionsUrl.toString(), index:currentTabIndex+1});
        }
    }

}
