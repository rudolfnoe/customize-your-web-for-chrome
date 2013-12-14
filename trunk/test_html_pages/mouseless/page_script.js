$(function(){
shortcut("asdf", '#searchsubmit');
shortcut("ctrl+shift+z", 
         {"jQuerySelectorForTarget":'#menu-item-32 a:eq(0)',
          "linkTarget":"tab"});
//click('#menu-item-32 a:eq(0)', {"modifierMask":ShortcutManager.SHIFT});
})
