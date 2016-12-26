# start-istanbul

[![npm](https://img.shields.io/npm/v/start-istanbul.svg?style=flat-square)](https://www.npmjs.com/package/start-istanbul)
[![linux build](https://img.shields.io/travis/start-runner/istanbul/master.svg?label=linux&style=flat-square)](https://travis-ci.org/start-runner/istanbul)
[![windows build](https://img.shields.io/appveyor/ci/start-runner/istanbul/master.svg?label=windows&style=flat-square)](https://ci.appveyor.com/project/start-runner/istanbul)
[![coverage](https://img.shields.io/codecov/c/github/start-runner/istanbul/master.svg?style=flat-square)](https://codecov.io/github/start-runner/istanbul)
[![deps](https://img.shields.io/gemnasium/start-runner/istanbul.svg?style=flat-square)](https://gemnasium.com/start-runner/istanbul)

[Istanbul](https://istanbul.js.org/) (ES6+ ready using Babel recently) tasks for [Start](https://github.com/start-runner/start).

## Install

```sh
npm install --save-dev start-istanbul
# or
yarn add --dev start-istanbul
```

## Usage

The sequence of tasks is simple: "instrument" sources, run tests, report collected code coverage and then check the result against provided thresholds (optional).

```js
import Start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import clean from 'start-clean';
import * as istanbul from 'start-istanbul';
import mocha from 'start-mocha';

const start = Start(reporter());

export const coverage = () => start(
  files('coverage/'),
  clean(),
  files('lib/**/*.js'),
  istanbul.instrument({ esModules: true }),
  files('test/**/*.js'),
  mocha(),
  istanbul.report([ 'lcovonly', 'html', 'text-summary' ]),
  istanbul.thresholds({ functions: 100 })
);
```

Instrument task relies on array of files, see [documentation](https://github.com/start-runner/start#readme) for details.

## Arguments

### instrument

`istanbul.instrument(options)`

* `options` – [Istanbul instrumenter options](https://github.com/istanbuljs/istanbul-lib-instrument/blob/master/api.md#instrumenter) (note that you can't change `coverageVariable` at this moment)

### report

`istanbul.report(formats)`

* `formats` – [Istanbul reporter formats](https://github.com/istanbuljs/istanbul-reports/tree/master/lib), `[ 'lcovonly', 'text-summary' ]` by default

### thresholds

`istanbul.thresholds(thresholds)`

* `thresholds` – `{ lines, statements, functions, branches }` object, `{}` by default

It works as [`check-coverage` command](https://github.com/gotwarlost/istanbul#the-check-coverage-command):

> Checks the coverage of `statements`, `functions`, `branches`, and `lines` against the provided thresholds. Positive thresholds are taken to be the minimum percentage required and negative numbers are taken to be the number of uncovered entities allowed.

Only defined keys will be processed, for example:

```js
{
  statements: 100,
  functions: -10
}
```
