import po2json from "../index.js";
import { readFileSync } from "node:fs";
import assert from "node:assert";
import { describe, it } from "node:test";

describe("parseFileSync", () => {
  it("parseFileSync", async () => {
    const json = await JSON.parse(
      readFileSync(import.meta.dirname + "/../test/fixtures/pl.json", "utf-8"),
    );
    const parsed = po2json.parseFileSync(
      import.meta.dirname + "/../test/fixtures/pl.po",
      null,
    );
    assert.deepStrictEqual(parsed, json);
  });
});
