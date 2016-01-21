# humid
[![Travis](https://img.shields.io/travis/miniArray/humid.svg)](https://travis-ci.org/miniArray/humid) [![Codecov](https://img.shields.io/codecov/c/github/miniArray/humid.svg)](https://codecov.io/github/miniArray/humid) [![npm](https://img.shields.io/npm/v/humid.svg)](https://www.npmjs.com/package/humid) [![GitHub issues](https://img.shields.io/github/issues/miniArray/humid.svg)](https://github.com/miniArray/humid/issues) [![GitHub license](https://img.shields.io/github/license/miniArray/humid.svg)](http://opensource.org/licenses/MIT)

--------------------------------------------------------------------------------

Scans and manages installed steam apps

## Install

```bash
npm install humid
```

## Usage

```javascript
var humid = require('humid');
humid.find('/path/to/steam/library')
    .then(res => console.log)
// Prints out array of results
```
