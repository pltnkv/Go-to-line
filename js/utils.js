function isPlainFile() {
	var pre = document.body ? document.body.children[0] : null;
	if (pre) {
		var style = pre.attributes[0] ? pre.attributes[0].value : null;
		return pre.nodeName === 'PRE' && style === 'word-wrap: break-word; white-space: pre-wrap;';
	} else {
		return false;
	}
}