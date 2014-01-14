OptionPageController = {
	cywConfig: chrome.extension.getBackgroundPage().CywConfig,
	timeId: 'FILTER_SCRIPT_TIMER',
	validateIframeWin: null,
	lastScriptError: null,
	scriptChanged: false,
	
   ajustLineNosJSCode: function(){
		var noOfLines = $('#onloadJSCode').val().split('\n').length
		noOfLines = Math.max(10, noOfLines);
		noOfLines = Math.min(30, noOfLines);
		$('#onloadJSCode').attr('rows', noOfLines);
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
	
	deleteScriptBtn: function(){
	   var res = window.confirm('This script will be deleted.');
	   if (!res){
	      return;
	   }
		this.cywConfig.deleteScript($('#uuid').val());
		this.initScriptsTable();
		this.initForm();
	},
	
	editScript: function(event){
		this.hideNotification();
		$target = $(event.currentTarget);
		var script = this.cywConfig.getScriptByUUIId($target.attr('data-edit-uuid'));
		$('#uuid').val(script.getUuid());
		$('#scriptName').val(script.getName());
		if (script.isDisabled()) {
		   $('#disabled').prop('checked','checked');
		   $('label[for=disabled]').addClass('highlightRed');
		} else {
		   $('label[for=disabled]').removeClass('highlightRed');
		}
		$('#urls').val(script.getUrlPatternString());
		$('#onloadJSCode').val(script.getOnloadJavaScript());
		//focus first field
		$('#scriptName').focus();
		//reset changed flag
		this.scriptChanged = false;
      
      
	},
   
	filterScriptTable: function(){
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
	},
   
   handleError: function(e){
     alert('Error occured: ' + e.toString()); 
   },
	
	hideNotification: function(){
		$('#alert').addClass('hidden');
	},
	
	importScripts: function(){
		try{
			var scripts = JSON.parse($('#impExpJSON').val());
		}catch(e){
			alert('Syntax error: ' + e.message);
		}
		if(!scripts){
			return;
		}
		for (var i=0; i<scripts.length; i++){
			var script = scripts[i];
			this.cywConfig.saveScript(Script.createFromJson(script));
		}
		$('#exportDlg').modal('hide');
		this.initScriptsTable();
		this.showNotification('Scripts successfully imported', 'alert-success', true);
		
	},
	
	init: function(){
		var self = this;
		this.validateIframeWin = $('#validate-iframe').get(0).contentWindow
		
		//Event-Handler
		$('#toggleAllChb').on('click', OptionPageController.toggleAllCheckboxes.bind(this));
	   $('#exportBtn').on('click', OptionPageController.showExportDialog.bind(this));
		$('#importBtn').on('click', OptionPageController.showImportDialog.bind(this));
		$('#saveBtn').on('click', OptionPageController.saveScript.bind(this));
		$('#applyBtn').on('click', OptionPageController.applyAndTestScript.bind(this));
		$('#deleteBtn').on('click', OptionPageController.deleteScriptBtn.bind(this));
		$('#cancelBtn').on('click', OptionPageController.cancelBtn.bind(this));
		$('#importBtnDlg').on('click', OptionPageController.importScripts.bind(this));
		$('#scriptFilter').on('keydown', function(event){
			if (event.keyCode != 13){
				return;
			}
			self.initScriptsTable();
		});
		$('#filterBtn').on('click', OptionPageController.initScriptsTable.bind(this));
		$('#onloadJSCode').on('keyup', OptionPageController.ajustLineNosJSCode.bind(this));

		//Script changed handler
		$('#scriptForm').find('input, textarea').on('change', function(){
			self.scriptChanged = true;
		});
		
		$(window).on('beforeunload', function(){
		   if(self.scriptChanged){
		   	   return 'Script has changed! Abord unloading for saving it.';
		   }
		});
		
		//Shortcuts
		shortcut('shift+alt+n', '#scriptName');
		shortcut('shift+alt+f', '#scriptFilter');
		shortcut('shift+alt+j', '#onloadJSCode');
		shortcut('shift+alt+e', '#exportBtn');
		shortcut('shift+alt+i', '#importBtn');
		shortcut('shift+alt+a', '#applyBtn');
		shortcut('shift+alt+s', '#saveBtn');
		shortcut('shift+alt+l', '#deleteBtn');
		shortcut('shift+alt+c', '#cancelBtn');
		listview('#scripts', 'tr',{shortcut:"shift+alt+p", highlightCss:'background-color:#f5f5f5', mutationObserverSelector:'#scripts'});

		//Set applied filter
		$('#scriptFilter').val('applied:');
		//Render Scrips-Table#
		this.initScriptsTable();
		
		$(function(){
			focus('#scriptFilter');
		});
	},
	
	initForm: function(){
		$('#scriptForm input,#scriptForm textarea').val('');
		$('#disabled').removeAttr('checked');
		$('label[for=disabled]').removeClass('highlightRed');
		//Reset changed flag
		this.scriptChanged = false;
	},
	
	initScriptsTable: function(){
		var self = this;
		var scripts = null;
		$('#scripts tr:gt(0)').remove();
		var filterVal = $('#scriptFilter').val().toLowerCase();
		if (filterVal.indexOf('applied:')==0){
			var currentUrl = chrome.extension.getBackgroundPage().MainController.getLastFocusedTabUrl();
			scripts = this.cywConfig.getActiveScriptsForUrl(currentUrl);
			filterVal = filterVal.substring(8);
		}else{
			scripts = this.cywConfig.getScripts();
		}
		
		scripts.forEach(function(script){
			if (self.isShowScript(script, filterVal)){
				$('<tr>' +
				  	'<td><a data-edit-uuid="' + script.uuid + '" href="#"><span class="glyphicon glyphicon-edit"></span></a></td>' +
				  	'<td><span ' + (script.disabled?'style="color:#999"':'') + '>'+ script.name + '</span></td>' +
					'<td align="center"><input type="checkbox" name="exportFlag" value="' + script.uuid + '"/></td>' + 
				'</tr>')
				.appendTo('#scripts');
			}
		});
		$('a[data-edit-uuid]').on('click', OptionPageController.editScript.bind(this));
	},
	
	isShowScript: function(script, filterVal){
		filterVal = filterVal?filterVal.toLowerCase():"";
		var fulltext = filterVal.indexOf('full:')==0;
		if (fulltext){
			filterVal = filterVal.substring(5);
		}
		if (script.name.toLowerCase().indexOf(filterVal) != -1 ||
		    (fulltext && script.getOnloadJavaScript().toLowerCase().indexOf(filterVal) != -1)){
			return true;
		} else {
			return false;
		}
		
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
      setTimeout(function(){
      	$('#onloadJSCode').focus();
      }, 1000);
   },
   
	showExportDialog: function(){
		var self = this;
		var scriptsToExport = [];
		$('#scripts input[type=checkbox]:checked').each(function(){
			scriptsToExport.push(self.cywConfig.getScriptByUUIId($(this).attr('value')));
		});
		$('#impExpJSON').val(JSON.stringify(scriptsToExport, null, 3));
		$('#importBtnDlg').hide();
		$('#exportDlg').modal({keyboard:true});
		$('#impExpJSON').focus();
	},
	
	showImportDialog: function(){
		$('#impExpJSON').val('');
		$('#importBtnDlg').show();
		$('#exportDlg').modal({keyboard:true});
		$('#impExpJSON').focus();
	},

	toggleAllCheckboxes: function(){
		var checked = $('#toggleAllChb').prop('checked');
		$('#scripts input[name=exportFlag]:visible').prop('checked', checked?true:false);
	},
	
   validateAndSaveScript: function(){
      if (!$('#scriptName').val()){
         alert('Please enter a script name');
         return;
      }
      if ( !$('#urls').val()){
         alert('Please enter a least on URL pattern');
         return;
      }  
      if( !$('#onloadJSCode').val()){
         alert('Please enter JavaScript Code');
         return;
      }
		var valid = this.validateJSCode();
		if (!valid){
			return false;
		}
		var updatedScript = this.cywConfig.saveScript(this.createScriptFromForm());
      this.scriptChanged = false;
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