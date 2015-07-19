function save_options() {
	var linksParsing = document.getElementById('linksParsing').checked;
	chrome.storage.sync.set({
		linksParsing: linksParsing
	}, function () {
		// Update status to let user know options were saved.
		var btn = document.getElementById('save');
		btn.innerText = 'Saved';
		setTimeout(function () {
			btn.innerText = 'Save';
		}, 1000);
	});
}

function restore_options() {
	chrome.storage.sync.get({
		linksParsing: true
	}, function (items) {
		document.getElementById('linksParsing').checked = items.linksParsing;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);