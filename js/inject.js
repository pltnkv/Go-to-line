console.log('inject.js loaded');
$(function () {
	var plainFile = isPlainFile();
	console.log('isPlainFile = ', plainFile);
	if (plainFile) {
		tryGoToLineAfterPageLoaded();
	}

	//console.log('!!!4', $('.graph-occurrences-minute-svg-container'), $('.traceback-inner'));
	//body.children.length)
	//style="word-wrap: break-word; white-space: pre-wrap;"

	/*if (Math.random() > 0.5) {
	 console.log('setDisabled');
	 chrome.runtime.sendMessage({setDisabled: true});
	 } else {
	 console.log('setEnabled');
	 chrome.runtime.sendMessage({setEnabled: true});
	 }*/
});

function isPlainFile() {
	if (document.body.children.length !== 1) {
		return false
	}
	var pre = document.body.children[0];
	return pre.nodeName === 'PRE' && pre.attributes[0].value === 'word-wrap: break-word; white-space: pre-wrap;';
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log('goToLine', request.lineNumber);
	goToLine(request.lineNumber);
});

function goToLine(lineNumber) {
	lineNumber = lineNumber - 1;//отсчитываем строки с нуля

	var pre = document.querySelectorAll('pre')[0];
	var snapId = 'id_' + Math.random();
	var openTag = '<span id="' + snapId + '" style="color:red;">';
	var closeTag = '</span>';
	var currentLineNumber = 0;
	if (lineNumber == 0) {
		pre.innerHTML = openTagW + pre.innerHTML;
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

	document.body.scrollTop = document.getElementById(snapId).offsetTop - 100;
}

function tryGoToLineAfterPageLoaded() {
	var lineNumber = parseInt(getParameterByName('gtl'));
	if (!isNaN(lineNumber) && lineNumber > 0) {
		goToLine(lineNumber);
	}
}

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}