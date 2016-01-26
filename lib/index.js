const coverageVariable = '__start_babel_istabul__';

export function istanbulInstrument(patterns, options) {
    return function babelIstanbulInstrument() {
        process.env.NODE_ENV = 'test';

        const globby = require('globby');
        const istanbul = require('babel-istanbul');

        return globby(patterns, { realpath: true }).then(function(files) {
            const instrumenter = new istanbul.Instrumenter({
                embedSource: true,
                noAutoWrap: true,
                ...options,
                coverageVariable
            });

            istanbul.hook.hookRequire(
                function(file) {
                    return files.indexOf(file) !== -1
                },
                function(source, file) {
                    return instrumenter.instrumentSync(source, file)
                }
            );
        });
    };
}

export function istanbulReport(reporters = [ 'lcovonly', 'text-summary' ], dir = 'coverage/') {
    return function babelIstanbulReport() {
        process.env.NODE_ENV = 'test';

        const path = require('path');
        const istanbul = require('babel-istanbul');

        const collector = new istanbul.Collector();

        collector.add(global[coverageVariable]);

        istanbul.hook.unhookRequire();
        delete global[coverageVariable];

        reporters.forEach(function(reporter) {
            istanbul.Report
                .create(reporter, { dir: path.resolve(dir) })
                .writeReport(collector, true /* sync */);
        });

        return Promise.resolve();
    };
}
