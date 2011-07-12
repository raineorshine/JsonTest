/** Represents a multiline string with an incrementable indent level. */
var MultilineString = function(level) {
	this.value = "";
	this.tabSize = 4;
	this.level = level || 0;
};
MultilineString.prototype = {

	/** Returns a string of spaces that matches the current indent level. */
	getIndent: function() {
		return " ".repeat(this.level * this.tabSize);
	},
	/** Appends the given string to the MultilineString (indented at the current level). */
	append: function(s) {
		return this.value += this.getIndent() + s;
	},
	/** Appends the given string to the MultilineString and adds a newline (indented at the current level). */
	appendLine: function(s) {
		return this.append(s + "\n");
	},
	getValue: function(s) {
		return this.value.trim();
	}
};

//s = new MultilineString(2);
//s.appendLine("object {");
//s.level++;
//s.appendLine("string test;");
//s.level--;
//s.appendLine("}");
//console.log("MultilineString test", s.value == "        object {\n            string test;\n        }\n");

