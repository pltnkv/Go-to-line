document.addEventListener('DOMContentLoaded', function () {
	createInput();
});

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