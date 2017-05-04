#!/usr/bin/env node
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

/* eslint-env node */
/* eslint promise/always-return:off */

const Commander = require("commander");
const Fs = require("fs-promise");
const Path = require("path");
const Rimraf = require("rimraf");
const Util = require("./run-utils");
const Version = require("../package.json").version;
const When = require("when");
const WhenNode = require("when/node");
// Transform mkdirp() to use promises.
const Mkdirp = WhenNode.lift(require("mkdirp"));

const DEFAULT_PROFILE = "dev";

Commander
  .version(Version)
  .option("-b, --binary <path>", "Path of Firefox binary to use.")
  .option("-p, --profile <path>", "Path or name of Firefox profile to use.")
  .option("--binary-args <CMDARGS>", "Pass additional arguments into Firefox.")
  .parse(process.argv);

function ensureRemoved(path) {
  return When.promise((resolve, reject) => {
    Fs.lstat(path).then(targetStat => {
      if (targetStat.isDirectory()) {
        Rimraf(path, err => {
          if (err) {
            reject(`Removing add-on directory '${path}' failed ${err}`);
            return;
          }

          resolve();
        });
      } else {
        // Removing old symlink or file.
        Fs.unlink(path).then(resolve).catch(reject);
      }
    }).catch(resolve);
  });
}

function onExit(...args) {
  let i = 0;
  let errLen = args.length;
  for (; i < errLen; ++i) {
    console.error(args[i].message || args[i]);
  }

  if (errLen) {
    process.exit(1); // eslint-disable-line no-process-exit
  }
}

let addonSourceDir = Path.normalize(Path.join(__dirname, "..", "add-on"));
let profile = Commander.profile || DEFAULT_PROFILE;
let extensionsDir;
let addonTargetDir;
Fs.stat(addonSourceDir).then(sourceStat => {
  if (!sourceStat.isDirectory()) {
    throw new Error("Not a directory");
  }
}).catch(err => onExit(err, "ERROR! Please run `make build` first!"))
  .then(() => Util.getProfilePath(profile))
  .catch(() => {
    // No valid profile path found, so bail out.
    onExit(`ERROR! Could not find a suitable profile.
            Please create a new profile '${profile}' and re-run this script.`); })
  .then(profilePath => {
    // Since we've got the profile path now, we can create the symlink in the
    // profile directory IF it doesn't exist yet.
    extensionsDir = Path.join(profilePath, "extensions");
    addonTargetDir = Path.join(extensionsDir, "exampleaddonrepo@mozilla.org");
    return Mkdirp(extensionsDir);
  })
  .then(() => ensureRemoved(addonTargetDir))
  // This should fail at a certain point, because we don't want the add-on
  // directory to exist.
  .then(() => Fs.symlink(addonSourceDir, addonTargetDir))
  .then(() => {
    console.log(`Symlinked add-on at '${addonTargetDir}'`);

    // Add-on should be in the correct place, so now we can run Firefox.
    return Util.runFirefox(Commander).catch(() => {
      // Ignore run Firefox issues and continue to cleanup
    })
    .then(() => {
      console.log("Removing symlink");
      return Fs.unlink(addonTargetDir);
    });
  })
.catch(onExit);
