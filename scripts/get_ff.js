"use strict";

const virtualenv = require("virtualenv");
const fs = require("fs");

const packagePath = require.resolve("../package.json");
let env = virtualenv(packagePath);

function getDownloadFileName() {
  switch (process.platform) {
    case "darwin":
      return "build/firefox-setup.dmg";
    case "linux":
      return "build/firefox-setup.tar.bz2";
    case "win32":
      return "build/firefox-setup.exe";
    default:
      throw new Error(`Unsupported platform ${process.platform}`);
  }
}

function installFirefox() {
  console.info("Installing...");

  let install = env.spawnPython(["scripts/install_ff.py", `${getDownloadFileName()}`]);

  install.on("close", code => {
    console.info("Complete");
  });
}

// Remove existing files
fs.unlink("build/templocation.txt", () => {
  fs.unlink("build/fflocation.txt", () => {
    fs.unlink("build/fflocation.bat", () => {
      fs.unlink(getDownloadFileName(), () => {
        // Then do the main download & install.
        console.info("Downloading...");

        let download = env.spawn("mozdownload", ["--version=latest", "-d", `${getDownloadFileName()}`]);

        download.on("close", installFirefox);
      });
    });
  });
});
