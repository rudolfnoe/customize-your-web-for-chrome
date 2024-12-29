import {Script} from "../datamodel/Script.js";
import {CywConfig} from "../background/CywConfig.js";
import { OptionPageUtils } from "./OptionPageUtils.js";

const OptionPageController = {
	timeId: 'FILTER_SCRIPT_TIMER',
	validateIframeWin: null,
	lastScriptError: null,
	scriptChanged: false,
	lastFocusedTabId: null,
	lastFocusedTabUrl: null,
	
	ajustLineNosJSCode: function(){
		var noOfLines = $('#onloadJSCode').val().split('\n').length
		noOfLines = Math.max(10, noOfLines+2);
		noOfLines = Math.min(30, noOfLines);
		$('#onloadJSCode').attr('rows', noOfLines);
	},
	
	cancelBtn: function(){
		this.hideNotification();
		if(this.askForSaveingOnChangedForm()){
	      this.initScriptsTable();
	      this.initForm();
		}
	},
	
	askForSaveingOnChangedForm: async function(){
      if (this.scriptChanged){
         var res = confirm('The script has changed. Press OK for saving it.');
         if (res){
            return await this.validateAndSaveScript();
         }
      }
      return true;
	},
	
	createScriptFromForm: function(){
		var script = new Script();
      	script.setUuid($('#uuid').val());
      	script.setName($('#scriptName').val());
      	script.setDisabled($('#disabled').prop('checked')?true:false);
      	script.setUrlPatternString($('#urls').val());
		script.setOnloadJavaScript($('#onloadJSCode').val());
		return script;
	},
	
	deleteScriptBtn: function(){
	   var res = window.confirm('This script will be deleted.');
	   if (!res){
	      return;
	   }
		CywConfig.deleteScript($('#uuid').val());
		this.notifyMainController();
		this.initScriptsTable();
		this.initForm();
	},
	
	editScript: async function(scriptId){
		this.hideNotification();
		if(scriptId != "new"){
			var script = await CywConfig.getScriptById(scriptId);
			if(!script){
			alert('No script found for Script-Id: ' + scriptId)
			}
		}
		$('#uuid').val(scriptId);
		$('#scriptName').val(script?.name);
		if (script?.isDisabled()) {
		   	$('#disabled').prop('checked','checked');
		   	$('label[for=disabled]').addClass('highlightRed');
		} else {
			$('#disabled').prop('checked', false);
		   	$('label[for=disabled]').removeClass('highlightRed');
		}
		$('#urls').val(script?.getUrlPatternString());
		$('#onloadJSCode').val(script?.getOnloadJavaScript());
		this.ajustLineNosJSCode();
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
		$('#alert').addClass('d-none');
	},
	
	importScripts: async function(){
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
			await CywConfig.saveScript(Script.createFromJson(script));
		}
		this.notifyMainController();
		$('#exportDlg').modal('hide');
		this.initScriptsTable();
		this.showNotification('Scripts successfully imported', 'alert-success', true);
	},
	
	init: async function(){
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
		$('#onloadJSCode').on('keydown', function(e){
			if(e.keyCode == 9 && !e.ctrlKey && !e.shiftKey){
				self.insertAtCaret('onloadJSCode', '   ');
				e.preventDefault();
			}
		});

		//Script changed handler
		$('#scriptForm').find('input, textarea').on('change', function(){
			self.scriptChanged = true;
		});
		
		$(window).on('beforeunload', function(){
		   if(OptionPageController.scriptChanged){
		   	   return 'Script has changed! Abord unloading for saving it.';
		   }
		});
		
		//Shortcuts
		shortcut('shift+alt+n', '#scriptName');
		shortcut('shift+alt+f', '#scriptFilter');
		shortcut('shift+alt+j', {selector:'#onloadJSCode',select:false});
		shortcut('shift+alt+e', '#exportBtn');
		shortcut('shift+alt+i', '#importBtn');
		shortcut('shift+alt+a', '#applyBtn');
		shortcut('shift+alt+s', '#saveBtn');
		shortcut('shift+alt+l', '#deleteBtn');
		shortcut('shift+alt+c', '#cancelBtn');
		listview('#scripts', 'tr',{shortcut:"shift+alt+p", highlightCss:'background-color:#f5f5f5', mutationObserverSelector:'#scripts', focusOnLoad:false});

		//Set applied filter
		//$('#scriptFilter').val('applied:');

      	//Render Scrips-Table#
      	this.initScriptsTable();
		
		//Init if script-id is provided
		let urlParams = new URLSearchParams(window.location.search);
		this.lastFocusedTabId = parseInt(urlParams.get('lastFocusedTabId'))
		this.lastFocusedTabUrl = urlParams.get('lastFocusedTabUrl')
		let scriptId = urlParams.get('scriptId')
		if (!scriptId){
			focus('#scriptName', {select:false});
		}else{
			await this.editScript(scriptId);
			focus('#onloadJSCode', {select:false});
		}
	},
	
	initForm: function(){
		$('#scriptForm input,#scriptForm textarea').val('');
		$('#disabled').removeAttr('checked');
		$('label[for=disabled]').removeClass('highlightRed');
		//Reset changed flag
		this.scriptChanged = false;
	},
	
	initScriptsTable: async function(){
		var self = this;
		var scripts = null;
		$('#scripts tr:gt(0)').remove();
		var filterVal = $('#scriptFilter').val().toLowerCase();
		if (false){//filterVal.indexOf('applied:')==0){
			scripts = CywConfig.getActiveScriptsForUrl(this.lastFocusedTabUrl);
			filterVal = filterVal.substring(8);
		}else{
			scripts = await CywConfig.getScripts();
		}
		
		scripts.forEach(function(script){
			if (self.isShowScript(script, filterVal)){
				$('<tr>' +
				  	'<td><a data-edit-id="' + script.uuid + '" ><span class="bi bi-pencil-square"></span></a></td>' +
				  	'<td><span ' + (script.disabled?'style="color:#999"':'') + '>'+ script.name + '</span></td>' +
					'<td align="center"><input type="checkbox" name="exportFlag" value="' + script.uuid + '"/></td>' + 
				'</tr>')
				.appendTo('#scripts');
			}
		});
		$('a[data-edit-id]').on('click', function(event){
		   if(self.askForSaveingOnChangedForm()){
		      OptionPageController.editScript($(event.currentTarget).attr('data-edit-id'));
		   }
		});
	},
	
	insertAtCaret: function(areaId,text) {
	    var txtarea = document.getElementById(areaId);
	    var strPos = txtarea.selectionStart;
	    var front = (txtarea.value).substring(0,strPos);  
	    var back = (txtarea.value).substring(strPos,txtarea.value.length); 
	    $(txtarea).val(front+text+back);
	    strPos = strPos + text.length;
        txtarea.selectionStart = strPos;
        txtarea.selectionEnd = strPos;
	},
	
	isShowScript: function(script, filterVal){
		filterVal = filterVal?filterVal.toLowerCase():"";
		var fulltext = filterVal.indexOf('full:')==0;
		if (fulltext){
			filterVal = filterVal.substring(5).toLowerCase();
		}
		if (script.name.toLowerCase().indexOf(filterVal) != -1 ||
		    (fulltext && script.getOnloadJavaScript().toLowerCase().indexOf(filterVal) != -1)){
			return true;
		} else {
			return false;
		}
		
	},
	
	
	saveScript: async function(){
		if(await this.validateAndSaveScript()){
			this.initScriptsTable();
			this.initForm();
		}
	},
	
	showNotification: function(text, alertClass, autohide){
		$('.alert').removeClass('alert-danger alert-success')
				   .addClass(alertClass)
				   .html(text);
		$('#alert').show().removeClass('d-none');
		if(autohide){
			setTimeout(function(){
				$('#alert').fadeOut();		
			}, 3000);
		}
	},
   
   	applyAndTestScript: async function(){
		var updatedScript = await this.validateAndSaveScript();
		if (!updatedScript){
			return;
		}
		$('#uuid').val(updatedScript.uuid);
		this.initScriptsTable();
		console.log(this.lastFocusedTabId)
		chrome.tabs.reload(this.lastFocusedTabId);
		chrome.tabs.update(this.lastFocusedTabId, {active: true});
		setTimeout(function(){
			$('#onloadJSCode').focus();
		}, 1000);
	},
   
	showExportDialog: async function(){
		console.log('show export dlg')
		let scriptsToExport = [];
		let selectedScripts = $('#scripts input[type=checkbox]:checked').toArray();
		for (let selectedScript of selectedScripts){
			let val = $(selectedScript).attr('value')
			if (!val){
				//Skip header checkbox
				continue;
			}
			let script = await CywConfig.getScriptById(val);
			delete script.targetWinDefinition.includeUrlPatternsRegExp;
			delete script.targetWinDefinition.excludeUrlPatternsRegExp;
			scriptsToExport.push(script);
		};
		$('#impExpJSON').val(JSON.stringify(scriptsToExport, null, 3));
		$('#importBtnDlg').hide();
		$('#impExpJSON').focus();
	},
	
	showImportDialog: function(){
		$('#impExpJSON').val('');
		$('#importBtnDlg').show();
		$('#impExpJSON').focus();
	},

	toggleAllCheckboxes: function(){
		var checked = $('#toggleAllChb').prop('checked');
		$('#scripts input[name=exportFlag]:visible').prop('checked', checked?true:false);
	},
	
   	validateAndSaveScript: async function(){
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
		var updatedScript = await CywConfig.saveScript(this.createScriptFromForm());
		this.notifyMainController();
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
			//TODO this.validateIframeWin.eval(jsCode);
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
   },

   notifyMainController: function(){
		chrome.runtime.sendMessage(null,{code:"reload-scripts"})
   }
	
}

$(document).ready(function(){
	OptionPageController.init();
});