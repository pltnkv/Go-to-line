/*function 	togglePanel(a) {
	chrome.tabs.executeScript(a, {code: "togglePanel();"})
}
function injectIntoTab(a, b) {
	function c(a, b) {
		var d = a.shift();
		d ? chrome.tabs.executeScript(null, {file: d}, function () {
			c(a, b)
		}) : b()
	}

	if (settings.get("enableStatistics")) {
		_gaq.push(["_trackPageview"]);
		var d = settings.toObject();
		for (var e in d) {
			var f = d[e], g = e.replace(/([a-z])([A-Z])/g, "$1_$2").toLowerCase();
			trackEvent("settings", g, null, String(f), !0)
		}
	}
	chrome.tabs.insertCSS(a, {file: "styles/style.css"}), chrome.tabs.insertCSS(a, {file: "styles/jquery-ui-1.10.2.modified.min.css"}), chrome.tabs.insertCSS(a, {file: "styles/compact-layers-section.css"});
	var h = settings.get("customCssCode");
	h && chrome.tabs.insertCSS(a, {code: h});
	var i = ["3rd-party/jquery-1.9.1.min.js", "3rd-party/jquery-ui-1.10.2.min.js", "3rd-party/underscore-min.js", "3rd-party/backbone-min.js", "3rd-party/backbone.localStorage-min.js", "3rd-party/canvas-to-blob.min.js", "imagetools.js", "shared.js", "models/model.js", "models/panel.js", "models/extensionService.js", "models/converters/converter.js", "models/converters/version-converters.js", "views/view.js", "content.js"];
	c(i, function () {
		"function" == typeof b ? b() : togglePanel(a)
	})
}
function check_if_PP_available_for_tab(a) {
	function b(b) {
		chrome.browserAction.setPopup({tabId: a.id, popup: b})
	}

	function c(b) {
		chrome.browserAction.setIcon({path: chrome.extension.getURL(b), tabId: a.id})
	}

	var d = "images/icons/icon.png";
	a.url.match(/^chrome:/) || a.url.match(/^https:\/\/chrome.google.com\/webstore/) || (a.url.match(/file:\//) ? chrome.extension.isAllowedFileSchemeAccess(function (a) {
		a ? (c(d), b("")) : b("popups/file-scheme-access-not-allowed.html")
	}) : (c(d), b("")))
}
function sendMessageToTab(a, b, c) {
	chrome.tabs.sendMessage(a, b, c)
}
function sendMessageToAllTabs(a) {
	chrome.tabs.query({status: "complete"}, function (b) {
		for (var c = 0; c < b.length; c++)chrome.tabs.sendMessage(b[c].id, a)
	})
}
function trackEvent(a, b, c, d, e) {
	if ("settings" == a || settings.get("enableStatistics")) {
		var f = ["_trackEvent", a, b];
		c && !isNaN(c) && isFinite(c) ? (d && void 0 !== d || (d = "value"), f.push(d), f.push(Math.round(c))) : d && void 0 !== d && f.push(d), e ? _trackEventsQueue.push(f) : _gaq.push(f)
	}
}
function sendPPFileResponse(a, b) {
	b(a instanceof PPFile ? {
		status: "OK",
		fileName: a.Name,
		fileType: a.MimeType,
		arrayBuffer: bufferToString(a.ArrayBuffer)
	} : a ? {status: "FAIL", message: a.message, showToUser: a.showToUser} : {status: "FAIL"})
}
var settings = new Store("settings", {
	debugMode: !1,
	customCssCode: "",
	rememberPanelOpenClosedState: !1,
	enableDeleteLayerConfirmationMessage: !0,
	allowPositionChangeWhenLocked: !0,
	allowHotkeysPositionChangeWhenLocked: !0,
	enableHotkeys: !0,
	enableMousewheelOpacity: !0,
	NewLayerMoveToScrollPosition: !0,
	NewLayerMakeActive: !0,
	NewLayerShow: !0,
	NewLayerUnlock: !0,
	enableStatistics: !0,
	disableSupportedByAd: !1
}), _gaq = _gaq || [];
_gaq.push(["_setAccount", "UA-26666773-2"]), $(document).ready(function () {
	if (!settings.get("debugMode")) {
		window.console || (window.console = {});
		for (var a = ["log", "debug", "warn", "info"], b = 0; b < a.length; b++)console[a[b]] = function () {
		}
	}
	if (settings.get("enableStatistics")) {
		var c = document.createElement("script");
		c.type = "text/javascript", c.async = !0, c.src = "https://ssl.google-analytics.com/ga.js";
		var d = document.getElementsByTagName("script")[0];
		d.parentNode.insertBefore(c, d)
	}
	chrome.tabs.getAllInWindow(null, function (a) {
		for (var b = 0; b < a.length; b++)check_if_PP_available_for_tab(a[b])
	})
});
var PP_state = [];
chrome.tabs.onUpdated.addListener(function (a, b, c) {
	"loading" == b.status && check_if_PP_available_for_tab(c)
}), chrome.browserAction.onClicked.addListener(function (a) {
	var b = PP_state[a.id];
	b ? ("open" == b ? PP_state[a.id] = "closed" : "closed" == b && (PP_state[a.id] = "open"), togglePanel(a.id)) : (PP_state[a.id] = "open", injectIntoTab(a.id))
}), chrome.tabs.onUpdated.addListener(function (a, b) {
	var c = PP_state[a];
	return settings.get("rememberPanelOpenClosedState") ? void(c && "closed" != c && "complete" === b.status && (PP_state[a] || (PP_state[a] = "open"), injectIntoTab(a))) : void delete PP_state[a]
}), chrome.runtime.onMessage.addListener(function (a, b, c) {
	if (a.type == PP_RequestType.getTabId)c({tabId: b.tab.id}); else if (a.type == PP_RequestType.ExecuteScript)chrome.tabs.executeScript(b.tab.id, a.options, function (a) {
		c(a)
	}); else if (a.type == PP_RequestType.OpenSettingsPage) {
		var d = chrome.extension.getURL("fancy-settings/source/index.html");
		chrome.tabs.query({url: d}, function (a) {
			a.length ? chrome.tabs.update(a[0].id, {active: !0}) : chrome.tabs.create({url: d}), c()
		})
	} else if (a.type == PP_RequestType.GetExtensionOptions) {
		var e = settings.toObject();
		e.defaultLocale = chrome.runtime.getManifest().default_locale, e.version = chrome.runtime.getManifest().version, c(e)
	} else if (a.type == PP_RequestType.TrackEvent) {
		var f = String(a.senderId), g = String(a.eventType), h = Number(a.integerValue), i = void 0 !== a.stringValue ? String(a.stringValue) : a.stringValue;
		trackEvent(f, g, h, i), c(!0)
	} else if (a.type == PP_RequestType.GETFILE || a.type == PP_RequestType.ADDFILE || a.type == PP_RequestType.DELETEFILE)PPFileManager.Init(function (b) {
		if (a.type == PP_RequestType.GETFILE) {
			var d = a.fileName;
			PPFileManager.GetFile(d, function (a) {
				sendPPFileResponse(a, c)
			})
		} else if (a.type == PP_RequestType.ADDFILE) {
			var e = new PPFile;
			e.ArrayBuffer = stringToBuffer(a.fileData), e.Name = a.fileName, e.MimeType = a.fileType, PPFileManager.SaveFile(e, function (a) {
				sendPPFileResponse(a, c)
			})
		} else if (a.type == PP_RequestType.DELETEFILE) {
			var d = a.fileName;
			PPFileManager.DeleteFiles(d, function () {
				c({status: "OK"})
			})
		} else sendPPFileResponse(b, c)
	}); else if (a.type == PP_RequestType.SetNotifications)(!localStorage[a.keyName] || parseInt(localStorage[a.keyName]) < parseInt(a.notifyId)) && (localStorage[a.keyName] = a.notifyId), sendMessageToAllTabs({type: PP_Background_RequestType.NotificationsUpdated}), c(!0); else if (a.type == PP_RequestType.GetNotifications) {
		var j = localStorage[a.keyName];
		c(j)
	}
	return !0
});
var _trackEventsQueue = [];
setInterval(function () {
	if (_trackEventsQueue.length > 0) {
		var a = _trackEventsQueue.pop();
		_gaq.push(a)
	}
}, 1e3);*/