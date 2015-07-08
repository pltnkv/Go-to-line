document.addEventListener('DOMContentLoaded', function () {
	createInput();
	tryGoToLineAfterPageLoaded();
});

function createInput() {
	var input = document.getElementById('lineNumber');
	input.addEventListener('keyup', function (e) {
		if (e.keyCode == 13) {
			if (goToLine(parseInt(input.value))) {
				window.close();
			} else {
				alert('Incorrect line number');
			}
		}
	})
}

function goToLine(lineNumber) {
	if (isNaN(lineNumber)) {
		return false;
	}
	if (lineNumber <= 0) {
		return false;
	}
	var code = execute.toString() + ';execute(' + lineNumber + ');';
	chrome.tabs.executeScript(null, {code: code});
	return true
}

function execute(lineNumber) {
	lineNumber = lineNumber - 1;//отсчитываем строки с нуля

	var pre = document.querySelectorAll('pre')[0];
	var snapId = 'id_' + Math.random();
	var openTag = '<span id="' + snapId + '" style="color:red;">';
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

	document.body.scrollTop = document.getElementById(snapId).offsetTop - 100;
}

function tryGoToLineAfterPageLoaded() {
	chrome.tabs.getSelected(null, function (tab) {
		var tablink = tab.url;
		var lineNumber = parseInt(getParameterByName(tablink, 'gtl'));
		goToLine(lineNumber);
	});
}

function getParameterByName(url, name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(url);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}