import po2json from "../index.js";
import { readFileSync } from "node:fs";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("parseFile", () => {
  it("parseFile", async () => {
    const json = JSON.parse(
      readFileSync(import.meta.dirname + "/../test/fixtures/pl.json", "utf-8"),
    );
    const parsed = await new Promise((resolve, reject) => {
      po2json.parseFile(
        import.meta.dirname + "/../test/fixtures/pl.po",
        null,
        function (err, data) {
          if (err) reject(err);
          resolve(data);
        },
      );
    });
    assert.deepStrictEqual(parsed, json);
  });
});
