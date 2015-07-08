var disabledTabs = [];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.setDisabled) {
		disabledTabs.push(sender.tab.id);
		disable(sender.tab.id);
	}
	if (request.setEnabled) {
		enable(sender.tab.id);
	}
});

chrome.tabs.onActivated.addListener(function (tabId) {
	if (isEnabledTab(tabId)) {
		enable(tabId);
	} else {
		disable(tabId);
	}
});

function isEnabledTab(tabId) {
	return disabledTabs.indexOf(tabId) == -1
}

function enable(tabId) {
	chrome.browserAction.enable(tabId);
	chrome.browserAction.setIcon({path: "icons/icon_16.png"});
}

function disable(tabId) {
	chrome.browserAction.disable(tabId);
	chrome.browserAction.setIcon({path: "icons/icon_disabled.png"});
}