var validatorUrl = "http://jsonformatter.curiousconcept.com/";

$(function() {
	$("#convert").click(function() {
		$("#error").hide();

		var obj;
		try {
			obj = JSON.parse($("#json").val());
		}
		catch(e) {
			$("#error").show();
			$("#orderly").val("");
			$("#error").html("Your JSON couldn't be parsed. Maybe you should <a href=\"{0}\">validate it</a>?".supplant([validatorUrl]));
			throw e;
		}

		$("#orderly").val(objectToOrderly(obj));
	});
});

/** Converts the given nested array of lines into an indented, multi-line string. Ignores null lines. */
var indent = function(lines, level, tabSize) {
	var tabSize = tabSize || 4;
	var level = level || 0;
	var getIndent = function(level) {
		return " ".repeat(level * tabSize);
	};
	var isValue = function(x) { 
		return x !== null && x !== undefined; 
	};

	var indentRecur = function(lines, level) {
		return lines.filter(isValue).map(function(child) {
			return child instanceof Array ? indentRecur(child, level+1) : // RECURSION
				getIndent(level) + child;

		}).join("\n");
	};

	return indentRecur(lines, level);
};
//console.log("TEST: indent");
//console.log(indent(
//[
//	"object {",
//	[
//		"integer id;",
//		"string name;",
//		"boolean isValid;"
//	],
//	"}"
//]));


/** Serializes an object into an orderly schema that validates it. */
var objectToOrderly = function(o, level) {
	var level = level || 0;
	var type = $.type(o);
	var typeLines = I.curry([type]);

	// maps the object's type to a warning message for that type
	var warnings = {
		"array": o.length ? 
			"Assuming all the elements of the array are the same type. Inferring from the first element." :
			"Empty array; cannot infer type of elements. Array elements will be validated as 'any'.",
		"number": "Ambiguous type: 'number' or 'integer'.",
		"null": "Ambiguous type: Use 'null' only if the value is always null. Use 'union { null; TYPE; }' if the value could be null or another type."
	};

	// maps the object's type to a function that returns the object's orderly schema in an array of lines
	var orderly = {
		"array": function() { return [
			"array [",
			(o.length ? objectToOrderly(o[0], level) : "any") + ";",
			"]"
		]},
		"object": function() { return [
			"object {",
			values(map(o, function(key, value) {
				return "{0} \"{1}\";".supplant([objectToOrderly(value, level+1), key]) // RECURSION
			})).join("\n"),
			"}"
		]},
		"number": typeLines,
		"null": typeLines,
		"string": typeLines,
		"boolean": typeLines
	};

	return indent([].concat(
		type in warnings ? "// WARNING: " + warnings[type] : null, 
		orderly[type]()
	), level);
};

//console.log("TEST: objectToOrderly");
//var obj = {
//  "name": "orderly",
//  "description": "A schema language for JSON",
//  "homepage": "http://orderly-json.org",
//  "invented": 2009,
//  "keywords": ["json", "schema"]
//};
//var output = "object {\n    string \"name\";\n    string \"description\";\n    string \"homepage\";\n    // WARNING: Ambiguous type: 'number' or 'integer'.\n    number \"invented\";\n    // WARNING: Assuming all the elements of the array are the same type. Inferring from the first element.\n    array [\n        string;\n    ] \"keywords\";\n}";
//console.log(objectToOrderly(obj) == output);
