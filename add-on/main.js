"use strict";

/* global chrome, browser */

chrome.browserAction.onClicked.addListener(() => {
  browser.tabs.create({
    active: true,
    url: "https://www.mozilla.org"
  });
});
