document.addEventListener('DOMContentLoaded', function () {
	createInput();
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

	chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {lineNumber: lineNumber});
	});

	return true
}