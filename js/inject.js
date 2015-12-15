$(function () {
	var plainFile = isPlainFile();
	if (plainFile) {
		tryGoToLine();
	} else {
		checkLinksParsingEnabled(function (enabled) {
			if (enabled) {
				prepareLinks();
				prepareRollbarPage();
			}
		})
	}
});

function checkLinksParsingEnabled(callback) {
	chrome.storage.sync.get({
		linksParsing: true
	}, function (items) {
		callback(items.linksParsing);
	});
}

chrome.runtime.onMessage.addListener(function (request) {
	goTo(request.lineNumber, request.columnNumber);
});

function goTo(lineNumber, columnNumber) {
	var span = goToLine(lineNumber);
	if (span && !isNaN(columnNumber) && columnNumber > 0) {
		goToColumn(span, columnNumber);
	}
	if (span) {
		document.body.scrollTop = span.offsetTop - 100;
	}
}

function goToLine(lineNumber) {
	lineNumber = lineNumber - 1;

	var pre = document.querySelectorAll('pre')[0];
	var spanId = 'id_' + Math.random();
	var openTag = '<span id="' + spanId + '" style="color:red;">';
	var closeTag = '</span>';
	var currentLineNumber = 0;
	if (lineNumber == 0) {
		pre.innerHTML = openTag + pre.innerHTML;
		pre.innerHTML = pre.innerHTML.replace(/\n/, closeTag + '\n');
	} else {
		pre.innerHTML = pre.innerHTML.replace(/\n/g, function () {
			currentLineNumber++;
			if (currentLineNumber == lineNumber) {
				return '\n' + openTag;
			} else if (currentLineNumber == lineNumber + 1) {
				return closeTag + '\n';
			} else {
				return '\n';
			}
		});
	}

	return document.getElementById(spanId)
}

function goToColumn(span, columnNumber) {
	var innerHTML = span.innerText;
	var columnOpenTag = '<span style="font-weight: bold;">';
	var closeTag = '</span>';
	innerHTML = innerHTML.replace(new RegExp('^.{' + (columnNumber - 1) + '}'), function (match) {
		return match + columnOpenTag;
	});
	innerHTML += closeTag;
	span.innerHTML = innerHTML;
}

function tryGoToLine() {
	var lineNumber = parseInt(getParameterByName('gtl'));
	var columnNumber = parseInt(getParameterByName('gtl_column'));
	if (!isNaN(lineNumber) && lineNumber > 0) {
		goTo(lineNumber, columnNumber);
	}
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function prepareLinks() {
	$('a').filter(function () {
		var lastPart = this.href.split('.').pop();
		return itLinkProbablyHasExtension(lastPart) && this.href.indexOf('?') == -1
	}).each(function () {
		var linkInfo = processLink(this);
		if (linkInfo) {
			this.href += '?gtl=' + linkInfo.lineNumber;
			if (linkInfo.columnNumber) {
				this.href += '&gtl_column=' + linkInfo.columnNumber;
			}
		}
	})
}

function processLink(linkElement) {
	for (var i = 0; i < linkProcessors.length; i++) {
		var linkInfo = linkProcessors[i](linkElement);
		if (linkInfo.lineNumber > 0) {
			return linkInfo;
		}
	}
	return null;
}

function itLinkProbablyHasExtension(ext) {
	return ext && ext.length <= 4
}

function prepareRollbarPage() {
	if (isRollbarPage()) {
		var element = document.querySelector('.tab-content pre');
		if (element) {
			var pattern = /(http[s]?:\/\/.*js):(\d+):(\d+)/gmi
			element.innerHTML = element.innerHTML.replace(pattern, '<a href="$1?gtl=$2&gtl_column=$3" target="_blank">$1:$2:$3</a>');
		}
	}
}

function isRollbarPage() {
	return location.host == "rollbar.com"
}