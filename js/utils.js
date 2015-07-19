function isPlainFile() {
	var pre = document.body.children[0];
	return pre.nodeName === 'PRE' && pre.attributes[0].value === 'word-wrap: break-word; white-space: pre-wrap;';
}