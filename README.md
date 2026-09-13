# po2json

[![CI](https://github.com/hainenber/po2json/actions/workflows/ci.yaml/badge.svg)](https://github.com/hainenber/po2json/actions/workflows/ci.yaml)

Convert PO files to Javascript objects or JSON strings. The result is Jed-compatible.

This is a maintained fork from excellent `mikeedwards/po2json`. I took the liberty to help keeping
the library up-to-date with current ES standard.

## Getting Started
Install the module with: `npm install po2json`

### As a library
```
const po2json = require('po2json');
```

### As an executable
```
po2json translation.po translation.json
```
__If you are using Jed >= 1.1.0, be sure to specify that format specifically.__
```
po2json translation.po translation.json -f jed1.x
```

## Documentation

### Methods

po2json has 3 methods, all of which take exactly the same options. The main function is `parse` which actually does the parsing to JSON. The 2 others - `parseFile` and `parseFileSync` are convenience functions to directly read PO data from a file and convert it to JSON.

Parse a PO buffer to JSON

* `po2json.parse(buf[, options])`
	* `buf` - a _po_ file as a Buffer or an unicode string.
	* `options` - an optional object with the following possible parameters:
		* `fuzzy` Whether to include fuzzy translation in JSON or not. Should be either `true` or `false`. Defaults to `false`.
		* `stringify` If `true`, returns a JSON string. Otherwise returns a plain Javascript object. Defaults to `false`.
		* `pretty` If `true`, the resulting JSON string will be pretty-printed. Has no effect when `stringify` is `false`. Defaults to `false`
		* `format` Defaults to `raw`.
			* `raw` produces a "raw" JSON output
			* `jed` produces an output that is 100% compatible with Jed >= 1.1.0
			* `jedold` produces an output that is 100% compatible with Jed < 1.1.0
			* `mf` produces simple key:value output.
		* `domain` - the domain the messages will be wrapped inside. Only has effect if `format: 'jed'`.
		* `fallback-to-msgid` If `true`, for those entries that would be omitted (fuzzy entries without the fuzzy flag) and for those
		that are empty, the msgid will be used as translation in the json file. If the entry is plural, msgid_plural will be used for
		msgstr[1]. This means that this option makes sense only for those languages that have nplurals=2.

Parse a PO file to JSON

* `po2json.parseFile(fileName[,options], cb)`
	* `fileName` - path to the po file
	* `options` - same as for `po2json.parse`
	* `cb` - a function that receives 2 arguments: `err` and `jsonData`

Parse a PO file to JSON (synchronous)

* `po2json.parseFileSync(fileName[, options])`
	* `fileName` - path to the po file
	* `options` - same as for `po2json.parse`

### Command Line Arguments

po2json in command-line parametrization support added to allow override
default options.

* --pretty, -p: same as pretty = true in function options
* --fuzzy, -F:  same as fuzzy = true in function options
* --format, -f: Output format (raw, jed, jedold, or mf)
* --full-mf, -M: return full messageformat output (instead of only translations)
* --domain, -d: same as domain in function options
* --fallback-to-msgid': 'use msgid if translation is missing (nplurals must match)

Note: `'format': 'mf'` means the json format used by messageFormatter in github.com/SlexAxton/messageformat.js
and `jedold` refers to Jed formats below 1.1.0

## Examples

### Basic usage with PO data as a buffer/string
```
const po2json = require('po2json'),
    fs = require('fs');
fs.readFile('messages.po', function (err, buffer) {
  const jsonData = po2json.parse(buffer);
  // do something interesting ...
});
```

### Parse a PO file directly - Asynchronous Usage
```
const po2json = require('po2json');
po2json.parseFile('messages.po', function (err, jsonData) {
    // do something interesting ...
});
```

### Parse a PO file directly - Synchronous Usage
```
const po2json = require('po2json');
const jsonData = '';
try {
    jsonData = po2json.parseFileSync('messages.po');
    // do something interesting ...
} catch (e) {}
```

### Parse a PO file to messageformat format
```
const po2json = require('po2json'),
    MessageFormat = require('messageformat');

po2json.parseFile('es.po', { format: 'mf' }, function (err, translations) {
    const pFunc = function (n) {
      return (n==1 ? 'p0' : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 'p1' : 'p2');
    };
    pFunc.cardinal = [ 'p0', 'p1', 'p2' ];
    const mf = new MessageFormat(
      {
        'es': pFunc
      }
    );
    const i18n = mf.compile( translations );
});
```

### Parse a PO file to messageformat format using the full format
```
const po2json = require('po2json'),
    MessageFormat = require('messageformat');

po2json.parseFile('messages.po', { format: 'mf', fullMF: true }, function (err, jsonData) {
    const mf = new MessageFormat(
        { [jsonData.headers.language]: jsonData.pluralFunction }
    );
    const i18n = mf.compile( jsonData.translations );
});
```

### Parse a PO file to Jed >= 1.1.0 format
```
const po2json = require('po2json'),
    Jed = require('jed');
po2json.parseFile('messages.po', { format: 'jed' }, function (err, jsonData) {
    const i18n = new Jed( jsonData );
});
```

### Parse a PO file to Jed < 1.1.0 format
__If you are using an older version of Jed, be sure to specify this format specifically.__
```
const po2json = require('po2json'),
    Jed = require('jed');
po2json.parseFile('messages.po', { format: 'jedold' }, function (err, jsonData) {
    const i18n = new Jed( jsonData );
});
```

### Running tests
```
npm test
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## License
Copyright (c) 2012 Joshua I. Miller
Licensed under the GNU, Library, General, Public, License licenses.
