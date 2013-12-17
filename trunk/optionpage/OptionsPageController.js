OptionPageController = {
	cywConfig: chrome.extension.getBackgroundPage().CywConfig,
	
	deleteScript: function(evemt){
		$targetElement = $(event.target);
		this.cywConfig.deleteScript($targetElement.attr('data-delete-uuid'));
		this.initScriptsTable();
	},
	
	createScriptFromForm: function(){
		var script = new Script();
      script.setUuid($('#uuid').val());
      script.setName($('#scriptName').val());
      script.setUrlPatterns($('#includeUrls').val());
		script.setOnloadJavaScript($('#onloadJSCode').val());
		return script;
	},
	
	editScript: function(event){
		$target = $(event.target);
		var script = this.cywConfig.getScriptByUUIId($target.attr('data-edit-uuid'));
		$('#uuid').val(script.getUuid());
		$('#scriptName').val(script.getName());
		$('#includeUrls').val(script.getIncludeUrlPatternString());
		$('#onloadJSCode').val(script.getOnloadJavaScript());
	},
	
	init: function(){
		$('#saveBtn').on('click', OptionPageController.saveScript.bind(this));
		$('#applyBtn').on('click', OptionPageController.applyAndTestScript.bind(this));
		this.initScriptsTable();
	},
	
	initScriptsTable: function(){
		$('#scripts tr:gt(0)').remove();
		var scripts = this.cywConfig.getScripts();
		scripts.forEach(function(script){
			$('<tr>' +
			  	'<td><a data-edit-uuid="' + script.uuid + '" href="#">Edit</a></td>' +
				'<td>'+ script.name + '</td>' +
				'<td><a data-delete-uuid="' + script.uuid + '" href="#">Delete</a></td></tr>')
			.appendTo('#scripts');
		});
		$('a[data-edit-uuid]').on('click', OptionPageController.editScript.bind(this));
		$('a[data-delete-uuid]').on('click', OptionPageController.deleteScript.bind(this));
	},
	
	saveScript: function(){
		this.cywConfig.saveScript(this.createScriptFromForm());
		this.initScriptsTable();
		$('#scriptForm input,#scriptForm textarea').val('');
	},
   
   applyAndTestScript: function(){
      this.cywConfig.saveScript(this.createScriptFromForm());
      this.initScriptsTable();
      var lastTabId = chrome.extension.getBackgroundPage().MainController.getLastFocusedTabId();
      chrome.tabs.reload(lastTabId);
      chrome.tabs.update(lastTabId, {active: true});
   }
	
}

$(document).ready(function(){
	OptionPageController.init();
});