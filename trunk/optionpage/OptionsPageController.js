OptionPageController = {
	cywConfig: chrome.extension.getBackgroundPage().CywConfig,
	
	deleteScript: function(evemt){
		$targetElement = $(event.currentTarget);
		this.cywConfig.deleteScript($targetElement.attr('data-delete-uuid'));
		this.initScriptsTable();
	},
	
	deleteScriptBtn: function(){
		this.cywConfig.deleteScript($('#uuid').val());
		this.initScriptsTable();
		this.initForm();
	},
	
	createScriptFromForm: function(){
		var script = new Script();
      script.setUuid($('#uuid').val());
      script.setName($('#scriptName').val());
      script.setDisabled($('#disabled').prop('checked')?true:false);
      script.setUrlPatterns($('#urls').val());
		script.setOnloadJavaScript($('#onloadJSCode').val());
		return script;
	},
	
	editScript: function(event){
		$target = $(event.currentTarget);
		var script = this.cywConfig.getScriptByUUIId($target.attr('data-edit-uuid'));
		$('#uuid').val(script.getUuid());
		$('#scriptName').val(script.getName());
		if (script.isDisabled()) {
		   $('#disabled').attr('checked','checked');
		}
		$('#urls').val(script.getUrlPatternString());
		$('#onloadJSCode').val(script.getOnloadJavaScript());
	},
	
	init: function(){
		$('#saveBtn').on('click', OptionPageController.saveScript.bind(this));
		$('#applyBtn').on('click', OptionPageController.applyAndTestScript.bind(this));
		$('#deleteBtn').on('click', OptionPageController.deleteScriptBtn.bind(this));
		this.initScriptsTable();
	},
	
	initForm: function(){
		$('#scriptForm input,#scriptForm textarea').val('');
		$('#disabled').removeAttr('checked');
	},
	
	initScriptsTable: function(){
		$('#scripts tr:gt(0)').remove();
		var scripts = this.cywConfig.getScripts();
		scripts.forEach(function(script){
			$('<tr>' +
			  	'<td><a data-edit-uuid="' + script.uuid + '" href="#"><span class="glyphicon glyphicon-edit"></span></a></td>' +
			  	'<td><a href="#" ' + (script.disabled?'style="color:#999"':'') + '>'+ script.name + '</a></td>' +
				'<td align="center"><a data-delete-uuid="' + script.uuid + '" href="#"><span class="glyphicon glyphicon-trash"></span></a></td></tr>')
			.appendTo('#scripts');
		});
		$('a[data-edit-uuid]').on('click', OptionPageController.editScript.bind(this));
		$('a[data-delete-uuid]').on('click', OptionPageController.deleteScript.bind(this));
	},
	
	saveScript: function(){
		this.cywConfig.saveScript(this.createScriptFromForm());
		this.initScriptsTable();
		this.initForm();
	},
   
   applyAndTestScript: function(){
      var updatedScript = this.cywConfig.saveScript(this.createScriptFromForm());
      $('#uuid').val(updatedScript.uuid);
      this.initScriptsTable();
      var lastTabId = chrome.extension.getBackgroundPage().MainController.getLastFocusedTabId();
      chrome.tabs.reload(lastTabId);
      chrome.tabs.update(lastTabId, {active: true});
   }
	
}

$(document).ready(function(){
	OptionPageController.init();
});