dojo.require("dojox.json.schema");

dojo.ready(function() {
	// get the test specifications and run them in QUnit
    dojo.xhrGet({
        url: "test-specifications.js",
        handleAs: 'json',
        load: function(test) {
			runQUnitJsonTests(test);
		}
	});
});
