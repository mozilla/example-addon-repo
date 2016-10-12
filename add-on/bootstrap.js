"use strict";
/* eslint no-implicit-globals:off, no-console:off */
/* exported startup, shutdown, install, uninstall */

function startup({webExtension}) {
  webExtension.startup().then(() => {
    console.log("Example WebExtension started!");
    return Promise.resolved();
  }).catch(() => {
    console.error("Example WebExtension startup failed!");
  });
}

function shutdown() {
}

function install() {

}

function uninstall() {
}
