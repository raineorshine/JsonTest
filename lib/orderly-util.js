/** Provides utility functions for using orderly schemas with QUnit and dojox.json.schema. */

/** Fires off an asyncTest for each given test specification. 
	@param orderlyTests		[
		schemaUrl: ...,
		jsonUrl: ...,
		callback: ...
	]
*/
var runQUnitJsonTests = function(tests) {
	tests.each(function(test) {
		asyncTest(test.name, function() {
			validateJson(
				test.schemaUrl, 
				test.jsonUrl,
				function(validationResults) {
					if(validationResults.valid) {
						ok(validationResults.valid, "JSON passed validation via schema '{0}'".supplant([test.schemaUrl]));
					}
					else {
						expect(validationResults.errors.length);
						validationResults.errors.each(function(error) {
							ok(validationResults.valid, buildValidationMessage(error));
						});
					}
					start();
				}
			);
		});
	});
};

/** Validates JSON with either an orderly or json schema from a given url. */
var validateJson = function(schemaUrl, jsonUrl, callback) {

	// function to call on error that throws a failed assertion in the test
	var schemaRequestError = function() {
		ok(false, "Error requesting schema at '{0}'".supplant(schemaUrl));
		start();
	};

    // detect orderly schema or json schema based on file extension
	var isOrderly = schemaUrl.indexOf(".orderly") > 0;
	dojo.xhrGet({
		url: schemaUrl,
		handleAs: isOrderly ? 'text' : 'json',
		load: function(schemaResult) {
			validateSchema(isOrderly ? orderly.parse(schemaResult) : schemaResult, jsonUrl, callback);
		},
		error: schemaRequestError
	});    
};

/** Validates JSON with the given json-schema object. */
var validateSchema = function(jsonSchemaObject, jsonUrl, callback) {
	// now load the JSON
	dojo.xhrGet({
		url: jsonUrl,
		handleAs: 'json',
		load: function(dataResult) {

			// now validate it!
			var result = dojox.json.schema.validate(dataResult, jsonSchemaObject);

			// show the result
			callback(result);
		},
		error: function() {
			ok(false, "Error requesting JSON at '{0}'".format(jsonUrl));
			start();
	   }
	});
};

/* Builds a message string from a validationResults object as returned by dojox.json.schema.validate. */
var buildValidationMessage = function(error) {
	return "{0} (property: {1}".supplant([error.message, error.property]);
};

