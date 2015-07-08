function goToLine(lineNumber) {
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