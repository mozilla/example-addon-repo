let buttons = require("sdk/ui/button/action");
let tabs = require("sdk/tabs");
let prefs = require("sdk/simple-prefs").prefs;

function handleClick(state) {
  tabs.open(prefs.buttonUrl);
}

buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: "./firefox-logo.svg",
  onClick: handleClick
});
