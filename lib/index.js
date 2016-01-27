const coverageVariable = '__start_coverage__';

export default {
    instrument(patterns, istanbul = require('istanbul'), options) {
        return function coverageInstrument() {
            process.env.NODE_ENV = 'test';

            const globby = require('globby');

            return globby(patterns, { realpath: true }).then(function(files) {
                const instrumenter = new istanbul.Instrumenter({
                    embedSource: true,
                    noAutoWrap: true,
                    ...options,
                    coverageVariable
                });

                istanbul.hook.hookRequire(
                    // hook requires which matches globby files
                    function(file) {
                        return files.indexOf(file) !== -1;
                    },
                    // and instrument that sources
                    function(source, file) {
                        return instrumenter.instrumentSync(source, file);
                    }
                );
            });
        };
    },

    report(reporters = [ 'lcovonly', 'text-summary' ], dir = 'coverage/', options) {
        return function coverageReport() {
            process.env.NODE_ENV = 'test';

            const istanbul = require('istanbul');

            istanbul.hook.unhookRequire();

            return new Promise(function(resolve) {
                const collector = new istanbul.Collector();
                const reporter = new istanbul.Reporter(options, dir);

                collector.add(global[coverageVariable]);
                reporter.addAll(reporters);
                reporter.write(collector, false /* async */, resolve);
            });
        };
    },

    thresholds(thresholds = {}) {
        return function coverageThresholds() {
            process.env.NODE_ENV = 'test';

            const istanbul = require('istanbul');

            const coverage = istanbul.utils.summarizeCoverage(global[coverageVariable]);
            const result = Object.keys(thresholds).reduce(function(errors, key) {
                const threshold = thresholds[key];
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
                return Promise.reject(result);
            }

            return Promise.resolve();
        };
    }
};
