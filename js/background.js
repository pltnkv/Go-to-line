chrome.tabs.onCreated.addListener(function (tab) {
	checkTab(tab.id);
});

chrome.tabs.onUpdated.addListener(function (tabId) {
	checkTab(tabId);
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
	checkTab(activeInfo.tabId);
});

function checkTab(tabId) {
	isSupportedTab(tabId, function (supported) {
		if (supported) {
			enable(tabId);
		} else {
			disable(tabId);
		}
	})
}

function isSupportedTab(tabId, callback) {
	chrome.tabs.get(tabId, function (tab) {
		var arr = tab.url.split("/");
		var scheme = arr[0];
		callback(scheme == 'http:' || scheme == 'https:');
	});
}

function enable(tabId) {
	chrome.browserAction.enable(tabId);
	chrome.browserAction.setIcon({path: "icons/icon_16.png"});
}

function disable(tabId) {
	chrome.browserAction.disable(tabId);
	chrome.browserAction.setIcon({path: "icons/icon_disabled.png"});
}