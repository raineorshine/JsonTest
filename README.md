This page describes a client-side JSON testing stack. You can use this setup to create automated tests for a JSON API.

[http://dev2.wallst.com/playground/raine/JsonTest/test.html http://dev2.wallst.com/playground/raine/JsonTest/test.html]

<span style="float:right">
[[File:Hub_ipad_api_json_test_qunit.png]]</span>

== Problem Description ==
You maintain a large JSON-based API that needs some automated tests so that you can check for data issues or regressions after refactoring/bug-fixing. You want to test that all of your API endpoints are returning JSON in the correct form, such as "always includes a 'status' field", or "documentCount is always greater than 0."

== Solution ==
Write [http://orderly-json.org/ Orderly Schemas] that compile into [https://github.com/kriszyp/json-schema JSONSchemas] to describe the required form of the JSON output. Write a test (with a testing framework like [http://docs.jquery.com/QUnit QUnit]) that will validate each of your API endpoints against the appropriate schema.

== What is an Orderly Schema? ==
A little bit of orderly...

  object {
    string name;
    string description?;
    string homepage /^http:/;
    integer {1500,3000} invented;
  }*;

...describes a little bit of JSON...

  {
    "name": "orderly",
    "description": "A schema language for JSON",
    "homepage": "http://orderly-json.org",
    "invented": 2009
  }

(If you're adding testing to an existing API, you don't have to write the Orderly Schema from scratch... see [[#Tips]] to generate a basic schema from existing JSON.)

== Instructions ==
# Copy the contents of \\d_www02\WebHome\wallstdomains\playground\raine\JsonTest to a folder in your project that will be accessible from the browser (the 'Content' folder in .NET). '''Must be on the same domain as the API you are testing since this code is purely client-side and subject to the browser's same origin policy.'''
# Ensure that the example test runs properly by navigating to test.html in your browser.
# Add test specifications to test-specifications.js. A test specification in this case is simply the direct url of the API endpoint you want to test and a url to the Orderly Schema (.orderly) or Json Schema (.json) that describes that JSON. 
# Use the [http://orderly-json.org/docs well-documented Orderly Schema documentation] to write the schema that describes your JSON.
# Refresh test.html and watch as your specified API endpoints are requested asynchronously and run against their schemas!

== Limitations ==
* '''The [https://github.com/zaach/orderly.js JS implementation of Orderly] has a parser bug so it [https://github.com/zaach/orderly.js doesn't support arrays!] If want to test JSON that contains arrays, you have to compile your Orderly Schema into JSONSchema on [http://orderly-json.org/tryit orderly-json.org]. Luckily, test-specifications.js also accepts schemas in JSONSchema format directly. Just save your JSONSchema with a .json extension in the schemas folder and reference that in the schemaUrl property of your test spec.'''
* Cannot be used to test an API on a different domain because the client-side HTTPRequests to the API urls are restricted by the browser's same origin policy.

== Tips ==
* If you have a fully functional API you can generate a basic Orderly schema from JSON by using the [http://dev2.wallst.com/playground/raine/JsonTest/jsonToOrderly.html jsonToOrderly converter].

