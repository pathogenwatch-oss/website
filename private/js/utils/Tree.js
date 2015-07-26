// Based on https://github.com/daviddao/biojs-io-newick/blob/master/src/newick.js
function getNewickLeafNames(s) {
  var leafNames = [];
	var ancestors = [];
	var tree = {};
	var tokens = s.split(/\s*(;|\(|\)|,|:)\s*/);
	for (var i=0; i<tokens.length; i++) {
		var token = tokens[i];
		switch (token) {
			case '(': // new children
				var subtree = {};
				tree.children = [subtree];
				ancestors.push(tree);
				tree = subtree;
				break;
			case ',': // another branch
				var subtree = {};
				ancestors[ancestors.length-1].children.push(subtree);
				tree = subtree;
				break;
			case ')': // optional name next
				tree = ancestors.pop();
				break;
			case ':': // optional length next
				break;
			default:
				var x = tokens[i-1];
				if (x == ')' || x == '(' || x == ',') {
          if (token) {
            leafNames.push(token);
          }
				} else if (x == ':') {
					tree.branch_length = parseFloat(token);
				}
		}
	}
	return leafNames;
}

function extractIdsFromNewick(newickString) {
  return getNewickLeafNames(newickString);
}

module.exports = {
  extractIdsFromNewick: extractIdsFromNewick
};
