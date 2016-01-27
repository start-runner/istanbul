[![npm](https://img.shields.io/npm/v/start-coverage.svg?style=flat-square)](https://www.npmjs.com/package/start-coverage)
[![travis](http://img.shields.io/travis/start-runner/coverage.svg?style=flat-square)](https://travis-ci.org/start-runner/coverage)
[![deps](https://img.shields.io/gemnasium/start-runner/coverage.svg?style=flat-square)](https://gemnasium.com/start-runner/coverage)

Code coverage tasks for [Start](https://github.com/start-runner/start). Uses [istanbul](https://github.com/gotwarlost/istanbul) by default, but is compatible with [babel-istanbul](https://github.com/ambitioninc/babel-istanbul), [isparta](https://github.com/douglasduteil/isparta), [ibrik](https://github.com/Constellation/ibrik) and so on.

## Install

```
npm i -D start-coverage
```

## Usage

The sequence of tasks is simple: "instrument" sources, run tests and then report collected code coverage.

```js
// tasks/index.js
import coverage from 'start-coverage';
import mocha from 'start-mocha';

export const test = [
    ...
    coverage.instrument('lib/**/*.js'),
    mocha('test/**/*.js'),
    coverage.report([ 'lcovonly', 'html', 'text-summary' ])
    ...
];
```

```js
// package.json
"scripts": {
  "task": "babel-node node_modules/.bin/start tasks/",
  "test": "npm run task test"
}
```

## Arguments

### instrument

`coverage.instrument(patterns, istanbul, options)`

* `patterns` – [globby patterns](https://github.com/sindresorhus/globby)
* `istanbul` – istanbul-compatible coverage tool, `require('istanbul')` by default
* `options` – [Instrumenter options](https://gotwarlost.github.io/istanbul/public/apidocs/classes/Instrumenter.html#method_Instrumenter), `{ embedSource: true, noAutoWrap: true }` by default

### report

`coverage.report(reporters, dir, options)`

* `reporters` – `[ 'lcovonly', 'text-summary' ]` by default
* `dir` – output directory, `coverage/` by default
* `options` – reporter options, none by default
