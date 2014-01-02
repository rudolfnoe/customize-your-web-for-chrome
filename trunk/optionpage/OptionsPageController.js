OptionPageController = {
	cywConfig: chrome.extension.getBackgroundPage().CywConfig,
	timeId: 'FILTER_SCRIPT_TIMER',
	validateIframeWin: null,
	lastScriptError: null,
	
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
	
	cancelBtn: function(){
		this.hideNotification();
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
		this.hideNotification();
		$target = $(event.currentTarget);
		var script = this.cywConfig.getScriptByUUIId($target.attr('data-edit-uuid'));
		$('#uuid').val(script.getUuid());
		$('#scriptName').val(script.getName());
		if (script.isDisabled()) {
		   $('#disabled').prop('checked','checked');
		}
		$('#urls').val(script.getUrlPatternString());
		$('#onloadJSCode').val(script.getOnloadJavaScript());
		//focus first field
		$('#scriptName').focus();
	},
	
	filterScriptTable: function(){
		Utils.executeDelayed(this.timeId, 300, function(){
			var filterTerm = $('#scriptFilter').val();
			if (!filterTerm){
				$('#scripts tr').show();
				return;
			}
			$('#scripts tr:gt(0)').each(function(){
				var scriptName = $(this).find('td:nth-child(2)').text();
				if (scriptName.toLowerCase().indexOf(filterTerm.toLowerCase()) >= 0){
					$(this).show();
				}else{
					$(this).hide();
				}
			});
		});
	},
	
	hideNotification: function(){
		$('#alert').addClass('hidden');
	},
	
	init: function(){
		this.validateIframeWin = $('#validate-iframe').get(0).contentWindow
		
		//Event-Hanlder
		$('#saveBtn').on('click', OptionPageController.saveScript.bind(this));
		$('#applyBtn').on('click', OptionPageController.applyAndTestScript.bind(this));
		$('#deleteBtn').on('click', OptionPageController.deleteScriptBtn.bind(this));
		$('#cancelBtn').on('click', OptionPageController.cancelBtn.bind(this));
		$('#scriptFilter').on('keyup', OptionPageController.filterScriptTable.bind(this));
		
		//Render Scrips-Table#
		this.initScriptsTable();
		
		//Shortcuts
		shortcut('shift+alt+f', '#scriptFilter');
		shortcut('shift+alt+j', '#onloadJSCode');
		listview('#scripts', 'tr',{shortcut:"shift+alt+p"});
		
		$(function(){
			focus('#scriptFilter');
		});
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
			  	'<td><span ' + (script.disabled?'style="color:#999"':'') + '>'+ script.name + '</span></td>' +
				'<td align="center"><a data-delete-uuid="' + script.uuid + '" href="#"><span class="glyphicon glyphicon-trash"></span></a></td></tr>')
			.appendTo('#scripts');
		});
		$('a[data-edit-uuid]').on('click', OptionPageController.editScript.bind(this));
		$('a[data-delete-uuid]').on('click', OptionPageController.deleteScript.bind(this));
	},
	
	
	saveScript: function(){
		if(this.validateAndSaveScript()){
			this.initScriptsTable();
			this.initForm();
		}
	},
	
	showNotification: function(text, alertClass, autohide){
		$('.alert').removeClass('alert-danger alert-success')
				   .addClass(alertClass)
				   .html(text);
		$('#alert').show().removeClass('hidden');
		if(autohide){
			setTimeout(function(){
				$('#alert').fadeOut();		
			}, 3000);
		}
	},
   
   applyAndTestScript: function(){
      var updatedScript = this.validateAndSaveScript();
      if (!updatedScript){
      	return;
      }
      $('#uuid').val(updatedScript.uuid);
      this.initScriptsTable();
      var lastTabId = chrome.extension.getBackgroundPage().MainController.getLastFocusedTabId();
      chrome.tabs.reload(lastTabId);
      chrome.tabs.update(lastTabId, {active: true});
   },
   
	validateAndSaveScript: function(){
		var valid = this.validateJSCode();
		if (!valid){
			return false;
		}
		var updatedScript = this.cywConfig.saveScript(this.createScriptFromForm());
		this.showNotification('Script successfully saved.', 'alert-success', true);
		return updatedScript;
	},
	
   validateJSCode: function(){
   		this.lastScriptError = null;
		var jsCode = $('#onloadJSCode').val();
		var jsCode = 'try{\n' + 
					jsCode +
					'} catch(e){' +
					  'top.OptionPageController.lastScriptError = e.message;' + 
					'}';
		var errMsg = null;
	    try{
			this.validateIframeWin.eval(jsCode);
	    }catch(e){
	    	errMsg = e.message; 
	    }
	    var errMsg = errMsg?errMsg:this.lastScriptError;
		if (errMsg){
			this.showNotification('<strong>Error in Script-Code:</strong> ' + errMsg, 'alert-danger');
			focus('#onloadJSCode', {select:false});
			return false;
		}else{
			return true;
		}
   }
	
}

$(document).ready(function(){
	OptionPageController.init();
});