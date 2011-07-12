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
			return;
		}

		$("#orderly").val(objectToOrderly(obj));
	});
});

/** Serializes an object into an orderly schema that validates it. */
var objectToOrderly = function(o, level) {
	var tabSize = 4;
	var level = level || 0;
	var orderly = new MultilineString(level);
	var type = $.type(o);
	switch(type) {
		case "array":
			orderly.appendLine("// WARNING: " + (o.length ? 
				"Assuming all the elements of the array are the same type. Inferring from the first element." :
				"Empty array; cannot infer type of elements. Array elements will be validated as 'any'."
			));
			orderly.appendLine("array [");
			orderly.level++;
			orderly.appendLine((o.length ? objectToOrderly(o[0], orderly.level) : "any") + ";"); // RECURSION
			orderly.level--;
			orderly.appendLine("]");
			break;
		case "object":
			orderly.appendLine("object {");
			orderly.level++;
			map(o, function(key, value) {
				orderly.appendLine("{0} \"{1}\";".supplant([objectToOrderly(value, orderly.level), key])); // RECURSION
			});
			orderly.level--;
			orderly.appendLine("}");
			break;
		case "number":
			orderly.appendLine("// WARNING: Ambiguous type: 'number' or 'integer'.");
			orderly.appendLine(type);
			break;
		case "string":
		case "boolean":
			orderly.appendLine(type);
			break;
		case "null":
			orderly.appendLine("// WARNING: Ambiguous type: Use 'null' only if the value is always null. Use 'union { null; TYPE; }' if the value could be null or another type.");
			orderly.appendLine(type);
			break;
		default:
			throw new Error("I don't know how to generate an orderly schema for type: " + type);
	}
	return orderly.getValue();
};

