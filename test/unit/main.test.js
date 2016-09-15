"use strict";

describe("main.js", function() {
  describe("browserAction", function() {
    it("should register a listener for onClicked", function() {
      sinon.assert.calledOnce(chrome.browserAction.onClicked.addListener);
    });
  });
});
