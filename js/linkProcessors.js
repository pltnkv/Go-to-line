var linkProcessors = [];
linkProcessors.push(function (linkElement) {
	var res = {};
	var nextElement = linkElement.nextElementSibling;
	if (nextElement) {
		res.lineNumber = parseInt(nextElement.innerText);
		nextElement = nextElement.nextElementSibling;
		if (nextElement) {
			res.columnNumber = parseInt(nextElement.innerText)
		}
	}
	return res
});