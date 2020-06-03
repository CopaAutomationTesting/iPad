var Cardio = require("nativescript-cardio").Cardio;
var cardio = new Cardio();

// TODO replace 'functionname' with an acual function name of your plugin class and run with 'npm test <platform>'
describe("functionname", function() {
  it("exists", function() {
    expect(cardio.functionname).toBeDefined();
  });

  it("returns a promise", function() {
    expect(cardio.functionname()).toEqual(jasmine.any(Promise));
  });
});