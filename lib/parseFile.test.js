const po2json = require("../index");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const { describe, it } = require('node:test');
const assert = require('node:assert');

describe("parseFile", () => {
  it("parseFile", async () => {
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/pl.json", "utf-8"));
    const parsed = await new Promise((resolve, reject) => {
      po2json.parseFile(__dirname + "/../test/fixtures/pl.po", null, function (err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
    assert.deepStrictEqual(parsed, json);
  });
});
