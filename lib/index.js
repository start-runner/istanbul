const coverageVariable = '__start_coverage__';

export function instrument(istanbul = require('istanbul'), options) {
    return function(input) {
        return function coverageInstrument(log) {
            const path = require('path');

            return new Promise((resolve, reject) => {
                const instrumenter = new istanbul.Instrumenter({
                    embedSource: true,
                    noAutoWrap: true,
                    ...options,
                    coverageVariable
                });
                istanbul.hook.hookRequire(
                    // hook requires which matches input files
                    function(file) {
                        return input.indexOf(file) !== -1;
                    },
                    // and instrument that sources
                    function(source, file) {
                        const result = instrumenter.instrumentSync(source, file);

                        log(file);

                        return result;
                    }
                );

                resolve(input);
            });
        };
    };
}

export function report(reporters = [ 'lcovonly', 'text-summary' ], dir = 'coverage/') {
    return function(input) {
        return function coverageReport(/* log */) {
            const istanbul = require('istanbul');

            istanbul.hook.unhookRequire();

            return new Promise((resolve, reject) => {
                const collector = new istanbul.Collector();
                const reporter = new istanbul.Reporter(null, dir);

                collector.add(global[coverageVariable]);
                reporter.addAll(reporters);
                reporter.write(collector, false /* async */, () => {
                    resolve(input);
                });
            });
        };
    };
}

export function thresholds(options = {}) {
    return function(input) {
        return function coverageoptions(/* log */) {
            const istanbul = require('istanbul');

            return new Promise((resolve, reject) => {
                const coverage = istanbul.utils.summarizeCoverage(global[coverageVariable]);
                const result = Object.keys(options).reduce((errors, key) => {
                    const threshold = options[key];
                    const summary = coverage[key];

                    // check percentage threshold
                    if (threshold > 0) {
                        if (summary.pct < threshold) {
                            return errors.concat(
                                `${key} percentage: ${summary.pct}% < ${threshold}%`
                            );
                        }
                    }

                    // check gap threshold
                    if (threshold < 0) {
                        if (summary.covered - summary.total < threshold) {
                            return errors.concat(
                                `${key} gap: ${summary.covered} - ${summary.total} < ${threshold}`
                            );
                        }
                    }

                    return errors;
                }, []);

                if (result.length > 0) {
                    return reject(result);
                }

                resolve(input);
            });
        };
    };
}
