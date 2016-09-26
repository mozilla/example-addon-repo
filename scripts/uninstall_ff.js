"use strict";

const fs = require("fs");
const async = require("async");

function removeFolder(location, next) {
  fs.readdir(location, (err, files) => { // eslint-disable-line handle-callback-err
    async.each(files, (file, cb) => {
      let newFile = `${location}/${file}`;
      fs.stat(newFile, (err, stat) => {
        if (err) {
          cb(err);
        }
        if (stat.isDirectory()) {
          removeFolder(newFile, cb);
        } else {
          fs.unlink(newFile, err => {
            if (err) {
              return cb(err);
            }
            return cb();
          });
        }
      });
    }, err => {
      if (err) {
        next(err);
        return;
      }
      fs.rmdir(location, err => next(err));
    });
  });
}

fs.readFile("build/templocation.txt", (err, data) => {
  if (err) {
    throw err;
  }

  removeFolder(data, err => {
    if (err) {
      throw err;
    }

    console.info("Done");
  });
});
