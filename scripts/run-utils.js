/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

/* eslint-env node */
/* eslint promise/always-return:off */

const Extend = require("lodash").extend;
const Fs = require("mz/fs");
const FxProfileFinder = require("firefox-profile/lib/profile_finder");
const FxRunner = require("fx-runner/lib/run");
const Path = require("path");
const When = require("when");

/**
 * Profiles that do not include "/" are treated as profile names to be used by
 * the Fx Profile Manager.
 *
 * @param {String} profile Name of the profile to test
 * @return {Boolean}
 */
function isProfileName(profile) {
  if (!profile) {
    return false;
  }
  return !/[\\/]/.test(profile);
}

/**
 * Retrieve the valid path of a profile.
 *
 * @param  {String}  profile Name or path of the profile
 * @return {Promise} Will be resolved with a valid absolute path pointing to the
 *                   profile or rejected when the path does not exist or when the
 *                   profile name can not be found.
 */
function getProfilePath(profile) {
  if (isProfileName(profile)) {
    let finder = new FxProfileFinder();
    return When.promise((resolve, reject) => {
      finder.getPath(profile, (err, path) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(path);
      });
    });
  }

  return When.promise((resolve, reject) => {
    let newProfile = Path.normalize(profile);
    if (!Path.isAbsolute(newProfile)) {
      newProfile = Path.join(process.cwd(), profile);
    }
    Fs.stat(newProfile).then(stat => {
      if (!stat.isDirectory()) {
        reject(`Profile path '${newProfile}' is not a directory`);
        return;
      }
      resolve(newProfile);
    }).catch(reject);
  });
}
exports.getProfilePath = getProfilePath;

// Environment variables that make sure that all messages and errors end up in
// the process stdout or stderr streams.
const FX_ENV = {
  "XPCOM_DEBUG_BREAK": "stack",
  "NS_TRACE_MALLOC_DISABLE_STACKS": "1"
};

/**
 * Check a chunk of process output to check if it contains an error message.
 *
 * @param  {String} line
 * @return {Boolean}
 */
function isErrorString(line) {
  return /^\*{25}/.test(line) || /^\s*Message: [\D]*Error/.test(line);
}

const GARBAGE = [
  /\[JavaScript Warning: "TypeError: "[\w\d]+" is read-only"\]/,
  /JavaScript strict warning: /,
  /###!!! \[Child\]\[DispatchAsyncMessage\]/
];

/**
 * Checks of the chunk of process output can be discarded. The patterns that are
 * tested against can be found in the `GARBAGE` array above.
 *
 * @param  {String} data
 * @return {Boolean}
 */
function isGarbage(data) {
  if (!data || !data.replace(/[\s\t\r\n]+/, "")) {
    return true;
  }
  for (let i = 0, l = GARBAGE.length; i < l; ++i) {
    if (GARBAGE[i].test(data)) {
      return true;
    }
  }
  return false;
}

/**
 * Output a chunk of process output to the console (Terminal).
 *
 * @param {String} data
 * @param {String} type Type of output; can be 'log' (default), 'warn' or 'error'
 */
function writeLog(data, type) {
  if (isGarbage(data)) {
    return;
  }
  process[(type === "error") ? "stderr" : "stdout"].write(data);
}

/**
 * Takes options, and runs Firefox. Inspiration of this code can be found at
 * https://github.com/mozilla-jetpack/jpm.
 *
 * @param {Object} options
 *   - `binary` path to Firefox binary to use
 *   - `profile` path to profile or profile name to use
 *   - `binaryArgs` binary arguments to pass into Firefox, split up by spaces
 * @return {Promise}
 */
function runFirefox(options) {
  return When.promise((resolve, reject) => {
    let newOptions = options || {};

    FxRunner({
      "binary": newOptions.binary,
      "foreground": true,
      "profile": newOptions.profile,
      "env": Extend({}, process.env, FX_ENV),
      "verbose": true,
      "binary-args": newOptions.binaryArgs
    }).then(results => {
      let firefox = results.process;

      console.log(`Executing Firefox binary: ${results.binary}`);
      console.log(`Executing Firefox with args: ${results.args}`);

      firefox.on("error", err => {
        if (/No such file/.test(err) || err.code === "ENOENT") {
          console.error(`No Firefox binary found at ${results.binary}`);
          if (!newOptions.binary) {
            console.error("Specify a Firefox binary to use with the `-b` flag.");
          }
        } else {
          console.error(err);
        }
        reject(err);
      });

      firefox.on("close", resolve);

      firefox.stderr.setEncoding("utf8");
      firefox.stderr.on("data", data => {
        if (/^\s*System JS : WARNING/.test(data)) {
          writeLog(data, "warn");
        } else {
          writeLog(data, "error");
        }
      });

      // Many errors in addons are printed to stdout instead of stderr;
      // we should check for errors here and print them out.
      firefox.stdout.setEncoding("utf8");
      firefox.stdout.on("data", data => {
        if (isErrorString(data)) {
          writeLog(data, "error");
        } else {
          writeLog(data);
        }
      });
    }).catch(ex => {
      reject(ex);
    });
  });
}
exports.runFirefox = runFirefox;
