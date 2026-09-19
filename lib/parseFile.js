import fs from "node:fs";
import parse from "./parse.js";

/**
 * Asynchronously parse a PO file to JSON
 *
 * @param {String} fileName - File name
 * @param {Object} [options]
 * @param {Function} cb - Callback function, takes 2 arguments: err and result
 */

export default function (fileName, options, cb) {
  options = options || {};

  if (typeof options === "function") {
    cb = options;
    options = {};
  }

  fs.realpath(fileName, function (err, realFile) {
    if (err) return cb(err);

    fs.readFile(realFile, function (err, data) {
      if (err) return cb(err);

      cb(null, parse(data, options));
    });
  });
}
