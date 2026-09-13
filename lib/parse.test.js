const Jed = require("jed");
const MessageFormat = require("messageformat");
const po2json = require("../index");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const assert = require('node:assert');
const { describe, it }  = require('node:test');

describe("parse", () => {

  it("parse", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/pl.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/pl.json", "utf-8"));
    const parsed = po2json.parse(po);
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with old Jed format", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/pl.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/pl-jedold.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'jedold'});
    assert.deepStrictEqual(parsed, json);
    assert.doesNotThrow(() => {
      new Jed(parsed)
    }, Error);
  });

  it("parse with current Jed format", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/pl.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/pl-jed.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'jed'});
    assert.deepStrictEqual(parsed, json);
    assert.doesNotThrow(() => {
      new Jed(parsed)
    }, Error);
  });

  it("parse with MessageFormatter format", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/pl.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/pl-mf.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'mf'});
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with MessageFormatter and compile successfully", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/pl.po");
    const translations = await po2json.parse(po, {format: 'mf'});

    const f = (n) => {
      return (n === 1 ? 'p0' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'p1' : 'p2');
    };
    f.cardinal = ['p0', 'p1', 'p2'];
    const mf = new MessageFormat(
      {
        'pl': f
      }
    );
    const messages = mf.compile(translations);
    assert.equal(messages['A sentence with "quotation" marks.']({}), "Zdanie w \"cudzysłowie\".");
    assert.equal(messages['one product']([1]), 'jeden produkt');
    assert.equal(messages['one product']([2]), '2 produkty');
    assert.equal(messages['one product']([12]), '12 produktów');
    assert.equal(messages['one product']([22]), '22 produkty');
    assert.equal(messages['string context']['the contextual phrase']({}), 'zwrot kontekstowe');
  });

  it("parse with full MessageFormatter format", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/pl.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/pl-mf-full.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'mf', fullMF: true});
    assert.deepStrictEqual(parsed.headers, json.headers);
    assert.deepStrictEqual(parsed.translations, json.translations);
  });

  it("parse with full MessageFormatter format and get plural function", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/pl.po");
    const parsed = po2json.parse(po, {format: 'mf', fullMF: true});
    assert.ok(parsed.pluralFunction);
    assert.equal(typeof parsed.pluralFunction, 'function');
  });

  it("parse with full MessageFormatter and compile successfully", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/pl.po");
    const parsed = await po2json.parse(po, {format: 'mf', fullMF: true});

    const locale = {};
    locale[parsed.headers.language] = parsed.pluralFunction;
    const mf = new MessageFormat(locale);
    const messages = mf.compile(parsed.translations);

    assert.equal(messages['']['A sentence with "quotation" marks.']({}), "Zdanie w \"cudzysłowie\".");
    assert.equal(messages['']['one product']([1]), 'jeden produkt');
    assert.equal(messages['']['one product']([2]), '2 produkty');
    assert.equal(messages['']['one product']([12]), '12 produktów');
    assert.equal(messages['']['one product']([22]), '22 produkty');
    assert.equal(messages['string context']['the contextual phrase']({}), 'zwrot kontekstowe');
  });

  it("parse with MessageFormatter format + fallback-to-msgid", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/en-empty.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/en-mf-fallback-to-msgid.json", "utf-8"));

    const parsed = po2json.parse(po, {format: 'mf', 'fallback-to-msgid': true});
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with fallback-to-msgid", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/en-empty.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/en-empty.json", "utf-8"));
    const parsed = po2json.parse(po, {'fallback-to-msgid': true});
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with Plural-Forms == nplurals=1; plural=0;", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/ja.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/ja.json", "utf-8"));
    const parsed = po2json.parse(po);
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with Plural-Forms == nplurals=1; plural=0; and with the current Jed format", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/ja.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/ja-jed.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'jed'});
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with no headers", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/en-no-header.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/en-no-header.json", "utf-8"));
    const parsed = po2json.parse(po);
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with raw JSON context correctly", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/es-context.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/es-context.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'raw'});
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with jed < 1.1.0 context correctly", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/es-context.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/es-context-jedold.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'jedold'});
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with jed >= 1.1.0 context correctly", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/es-context.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/es-context-jed.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'jed'});
    assert.deepStrictEqual(parsed, json);
  });

  it("parse with MessageFormat context correctly", async () => {
    const po = await readFile(__dirname + "/../test/fixtures/es-context.po");
    const json = await JSON.parse(await readFile(__dirname + "/../test/fixtures/es-context-mf.json", "utf-8"));
    const parsed = po2json.parse(po, {format: 'mf'});
    assert.deepStrictEqual(parsed, json);
  });

  it("handle braces in mf with messageformat options", async () => {
    this.po = `
      msgid "test"
      msgstr "Hi %{firstname}"
    `;
    //this.json = JSON.parse(`{ "test": "Hi %\\\\{firstname\\\\}" }`);
    this.json = await JSON.parse(`{ "test": "Hi %{firstname}" }`);

    const mfOptions = {
      replacements: [
        {
          pattern: /%(\d+)(?:\$\w)?/g,
          replacement: (_, n) => `{${n - 1}}`
        },
        {
          pattern: /%\((\w+)\)\w/g,
          replacement: '{$1}'
        },
        {
          pattern: /%\w/g,
          replacement: function () {
            return `{${this.n++}}`
          },
          state: {n: 0}
        },
        {
          pattern: /%%/g,
          replacement: '%'
        }
      ]
    };

    const parsed = po2json.parse(this.po, {format: 'mf', mfOptions: mfOptions});
    assert.deepStrictEqual(parsed, this.json);
  });
});
