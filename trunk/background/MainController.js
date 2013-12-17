MainController = {

	init : function() {
		// chrome.webNavigation.onDOMContentLoaded.addListener(MainController.onDomContentLoaded.bind(this));
		// Listener for messages from content script
		chrome.runtime.onMessage.addListener(function(request, sender,
						sendResponse) {
					console.log(sender.tab ? "from a content script:"
							+ sender.tab.url : "from the extension");
					var scripts = CywConfig.getActiveScriptsForUrl(request.url);
					var jsCode = "";
					scripts.forEach(function(script) {
								jsCode += "\n" + script.onloadJavaScript;
							});
					sendResponse({
								jsCode : jsCode
							});
				});

		// Listener for commands
		chrome.commands.onCommand.addListener(function(command) {
					console.log('Command:', command);
					var optionsUrl = chrome.extension.getURL('options.html');

					chrome.tabs.query({
								url : optionsUrl
							}, function(tabs) {
								if (tabs.length) {
									chrome.tabs.update(tabs[0].id, {
												active : true
											});
								} else {
									chrome.tabs.create({
												url : optionsUrl
											});
								}
							});
				});

		console.log('CYW Main Controller set up.')
	},

	onDomContentLoaded : function(details) {
		if (details.frameId != 0)
			return;
		console.log(details.url);
		var scripts = CywConfig.getActiveScriptsForUrl(details.url);
	}
}
MainController.init();