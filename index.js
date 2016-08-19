var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var prefs = require("sdk/simple-prefs").prefs;

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: "./firefox-logo.svg",
  onClick: handleClick
});

function handleClick(state) {
  tabs.open(prefs.buttonUrl);
}
