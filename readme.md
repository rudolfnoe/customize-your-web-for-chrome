# Customize your Web

## Prerequisites
As this extension uses so called User-Scripts, you must enable the extension developer mode. To do this 
1. Go to the Extensions page by entering chrome://extensions in a new tab. (By design chrome:// URLs are not linkable.)
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.

## Basic Concept
Customize your Web lets you customize any website through the declaration of small JavaScript Code-Snippets. It differes from other UserScript-Managers that it offers an API for common customizations and addiontionally injects jQuery for more advanced customizations. The main purpose of the API is to provide an easy manner to define keyboard shortcuts and listviews for keyboard navigation.

## Getting Started
To create your first script open the Option Page via the extension menu in the upper right corner (Icon ![Alt text](./src/resources/cyw.ico?raw=true "Title")) or just press Alt+Shif+Y on Windows or Command+Shift+Y on Mac.

## Option Page
On the option page you see on the left side the already defined scripts. On the right side you create or edit scripts. To add a new script just enter the name of the script, the URL-pattern(s) and the code and then press save.

For the URL-Patters the following rules apply:
* You must write each pattern on a separate line
* Use "*" as wildcard character.
* Patterns must also include the protocol (e.g. http://) or must start with "*"
* Exclude patterns are defined by putting a "-" in front of the pattnern.
* If an exclude pattern matches the URL the script is not applied 

Examples:  
https://myrealybestdomainintheworld.org/* -> Matches all pages beginning with https://myrealybestdomainintheworld.org/<br>
*/mycontextpath/* -> Matches all pages containing "/mycontextpath/"<br>
-https://myrealybestdomainintheworld.org/exlucde/* -> Exclude all pages beginning with https://myrealybestdomainintheworld.org/exlucde/

## API

### jQuery
jQuery is injected into every page and available via the well known "$" variable. Within the API you can use any valid jQuery-Selector to reference elements on a page.

### Click
The click-API performs a click event on an element. It have two signatures:

    click(jQuerySelector);

Performs a simple click on the first element matching the selector.

    click(jQuerySelector, {"button": 0,  "modifierMask": ShortcutManager.CTRL|ShortcutManager.SHIFT|ShortcutManager.ALT,"pos":"first"});

* jQuerySelector: See above
* Configuration-Object:
    * button (optional): see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/MouseEvent for posible values
    * modifierMask (optional): Defines which modifier keys should be simulated during the click event. One or a a combination of ShortcutManager.CTRL|ALT|SHIFT
      E.g. ShortcutManager.CTRL|ShortcutManager.SHIFT if both keys should be pressed during the click event.
    * pos (optional): When given a click is simulated on the n-th element matching the jQuery-selector

### Keyboard-Shortcuts/Shortstrings
The extension supports only Windows modifier keys like ALT, CTRL, SHIFT! You can also define what i call "Shortstring", i.e. a combianation of keys like "abc" 
The keyCombination is writen by separating the modifiers and the others keys by the plus sign. Examples:  
* ctrl+shift+f
* alt+ctrl+shift+g
* abc 

The Shortcut API comes with three signatures:

    shortcut(keyCombination, jQuerySelector);  

This persforms a click on the the first element matching the provided jQuery-selector. 

    shortcut(keyCombination, function() { });

This version gets a key combiantion and a function and executes the function code when the key combination is pressed.

    shortcut(keyCombination, {"jQuerySelector": null, "callback" : function(){ }, "pos": "first", "linkTarget": LinkTarget.TAB})

This version gets a key combination an an JS-Object with the following properties:
* jQuerySelector(optional): When given the behavior is the same as with the firt signature
* callback (optional): When given the behavior is the same as with the second signature
* pos (optional): See click event
* linktarget (Optional). Defines where the clicked link should be opened.
    * LinkTarget.CURRENT: Opens link in same tab.
    * LinkTarget.TAB: Opens link in new tab.
    * LinkTarget.WINDOW: Opens link in new window.

### Listview
The purpose of this API is to make lists on webpages keyboard navigateable (e.g. the Google Search Resultlist). The listview supports the following fixed keyboard navigation:
* j/k: Move to next/previous item
* Cursor down/up: Move to next/previous item
* Page down/up: Jumps to fist/last item in the listview
* Enter: Performs a click by default on the first link with the currently selected listview item

The following methods exist:

    listview(rootElementjQuerySelector, listItemjQuerySelectorOrJQueryObj);

* rootElementjQuerySelector: jQuery-selector for the root element (container element) of the items forming the listview.
* listItemjQuerySelectorOrJQueryObj: The parameter could be either a jQuery selector relative to the root element (e.g. "tr" if the root element is "table") or a   jQuery-Object itself.

<!--End bullet-->
    listview(
        rootElementSelector, 
        listItemSelectorOrJQueryObj,{
            "shortcut": null, 
            "focusOnLoad": true, 
            "linkTarget": LinkTarget.TAB, 
            "noOfHeaderRows": 1, 
            "linkNoToOpen" : 1, 
            "pos": "first", 
            "mutationObserverSelector": null
        }
    );

* rootElementjQuerySelector: See above
* listItemjQuerySelectorOrJQueryObj: See above
* Config-Object (all optional):
    * shortcut: Key combination for focusing the listview.
    * focusOnLoad (true/false): Boolean defining wether the listview should get the keyboard focus after it has (re-)loaded.
    * linkTarget: See shortcut API
    * noOfHeaderRows: If set the keyboard navigation ignores the given number of rows.
    * linkNoToOpmen: If set the n-th link is opened when pressing enter.
    * pos: If set the n-th element matching the rootElementjQuerySelector is taken as the root element.
    * mutationObserverSelector: If the set the listview is newly initialized every time the DOM changes within the element matching this selector. This selector must be used when the contents of the listview can change without the whole page is reloaded (e.g. on almost all search engines sites).
