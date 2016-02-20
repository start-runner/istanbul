# start-istanbul

[![npm](https://img.shields.io/npm/v/start-istanbul.svg?style=flat-square)](https://www.npmjs.com/package/start-istanbul)
[![linux build](https://img.shields.io/travis/start-runner/istanbul.svg?label=linux&style=flat-square)](https://travis-ci.org/start-runner/istanbul)
[![windows build](https://img.shields.io/appveyor/ci/start-runner/istanbul.svg?label=windows&style=flat-square)](https://ci.appveyor.com/project/start-runner/istanbul)
[![coverage](https://img.shields.io/codecov/c/github/start-runner/istanbul.svg?style=flat-square)](https://codecov.io/github/start-runner/istanbul)
[![deps](https://img.shields.io/gemnasium/start-runner/istanbul.svg?style=flat-square)](https://gemnasium.com/start-runner/istanbul)
[![gitter](https://img.shields.io/badge/gitter-join_chat_%E2%86%92-00d06f.svg?style=flat-square)](https://gitter.im/start-runner/start)

[Istanbul](https://github.com/gotwarlost/istanbul) tasks for [Start](https://github.com/start-runner/start). Compatible with [babel-istanbul](https://github.com/ambitioninc/babel-istanbul), [isparta](https://github.com/douglasduteil/isparta), [ibrik](https://github.com/Constellation/ibrik) and so on.

## Install

```
npm i -D start-istanbul
```

## Usage

The sequence of tasks is simple: "instrument" sources, run tests, report collected code coverage and then check result against the provided thresholds (optional).

```js
import start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import clean from 'start-clean';
import * as istanbul from 'start-istanbul';
import mocha from 'start-mocha';

export function coverage() {
    return start(reporter())(
        files('coverage/'),
        clean(),
        files('lib/**/*.js'),
        istanbul.instrument(),
        files('test/**/*.js'),
        mocha(),
        istanbul.report([ 'lcovonly', 'html', 'text-summary' ]),
        istanbul.thresholds({ functions: 100 })
    );
}
```

Instrument task relies on array of files, see [documentation](https://github.com/start-runner/start#readme) for details.

## Arguments

### instrument

`istanbul.instrument(istanbul, options)`

* `istanbul` – istanbul-compatible coverage tool, `require('istanbul')` by default
* `options` – [Instrumenter options](https://gotwarlost.github.io/istanbul/public/apidocs/classes/Instrumenter.html#method_Instrumenter), `{ embedSource: true, noAutoWrap: true }` by default

### report

`istanbul.report(reporters, dir)`

* `reporters` – `[ 'lcovonly', 'text-summary' ]` by default
* `dir` – output directory, `coverage/` by default

### thresholds

`istanbul.thresholds(thresholds)`

Same as [istanbul `check-coverage` command](https://github.com/gotwarlost/istanbul#the-check-coverage-command):

> Checks the coverage of `statements`, `functions`, `branches`, and `lines` against the provided thresholds. Positive thresholds are taken to be the minimum percentage required and negative numbers are taken to be the number of uncovered entities allowed.

Only defined keys will be processed:

```js
{
    statements: 100,
    functions: -10
}
```
