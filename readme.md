# start-coverage

[![npm](https://img.shields.io/npm/v/start-coverage.svg?style=flat-square)](https://www.npmjs.com/package/start-coverage)
[![travis](http://img.shields.io/travis/start-runner/coverage.svg?style=flat-square)](https://travis-ci.org/start-runner/coverage)
[![coverage](https://img.shields.io/codecov/c/github/start-runner/coverage.svg?style=flat-square)](https://codecov.io/github/start-runner/coverage)
[![deps](https://img.shields.io/gemnasium/start-runner/coverage.svg?style=flat-square)](https://gemnasium.com/start-runner/coverage)
[![gitter](https://img.shields.io/badge/gitter-join_chat_%E2%86%92-00d06f.svg?style=flat-square)](https://gitter.im/start-runner/start)

Code coverage tasks for [Start](https://github.com/start-runner/start). Uses [istanbul](https://github.com/gotwarlost/istanbul) by default, but is compatible with [babel-istanbul](https://github.com/ambitioninc/babel-istanbul), [isparta](https://github.com/douglasduteil/isparta), [ibrik](https://github.com/Constellation/ibrik) and so on.

## Install

```
npm i -D start-coverage
```

## Usage

The sequence of tasks is simple: "instrument" sources, run tests, report collected code coverage and then check result against the provided thresholds (optional).

```js
import start from 'start';
import reporter from 'start-pretty-reporter';
import files from 'start-files';
import clean from 'start-clean';
import * as coverage from 'start-coverage';
import mocha from 'start-mocha';

export function coverage() {
    return start(reporter())(
        files('coverage/'),
        clean(),
        files('lib/**/*.js'),
        coverage.instrument(),
        files('test/**/*.js'),
        mocha(),
        coverage.report([ 'lcovonly', 'html', 'text-summary' ]),
        coverage.thresholds({ functions: 100 })
    );
}
```

Instrument tasks is rely on array of files, see [documentation](https://github.com/start-runner/start#readme) for details.

## Arguments

### instrument

`coverage.instrument(istanbul, options)`

* `istanbul` – istanbul-compatible coverage tool, `require('istanbul')` by default
* `options` – [Instrumenter options](https://gotwarlost.github.io/istanbul/public/apidocs/classes/Instrumenter.html#method_Instrumenter), `{ embedSource: true, noAutoWrap: true }` by default

### report

`coverage.report(reporters, dir)`

* `reporters` – `[ 'lcovonly', 'text-summary' ]` by default
* `dir` – output directory, `coverage/` by default

### thresholds

`coverage.thresholds(thresholds)`

Same as [istanbul `check-coverage` command](https://github.com/gotwarlost/istanbul#the-check-coverage-command):

> Checks the coverage of `statements`, `functions`, `branches`, and `lines` against the provided thresholds. Positive thresholds are taken to be the minimum percentage required and negative numbers are taken to be the number of uncovered entities allowed.

Only defined keys will be processed:

```js
{
    statements: 100,
    functions: -10
}
```
