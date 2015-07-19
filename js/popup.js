document.addEventListener('DOMContentLoaded', function () {
	pageIsPlainFile(function (isPlainFile) {
		if (isPlainFile) {
			createInput();
		} else {
			showError();
		}
	})
});

function pageIsPlainFile(callback) {
	var code = isPlainFile.toString() + ';isPlainFile()';
	chrome.tabs.executeScript({code: code}, function (args) {
		callback(args[0])
	});
}

function showError() {
	document.getElementById('content').style.display = 'none';
	document.getElementById('errorMsg').style.display = 'block';

}

function createInput() {
	var input = document.getElementById('lineNumber');
	input.addEventListener('keyup', function (e) {
		if (e.keyCode == 13) {
			console.log(input.value);
			var parts = input.value.split(':');
			console.log(parts);
			var lineNumber = parseInt(parts[0]);
			var columnNumber = parseInt(parts[1]);
			if (lineNumber > 0) {
				dispatchTransition(lineNumber, columnNumber);
				window.close();
			} else {
				alert('Incorrect line number' + lineNumber + ' ' + columnNumber + 'parts' + parts.toString());
			}
		}
	})
}

function dispatchTransition(lineNumber, columnNumber) {
	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {lineNumber: lineNumber, columnNumber: columnNumber});
	});
}