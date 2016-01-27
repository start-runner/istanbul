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
                    function(file) {
                        return files.indexOf(file) !== -1;
                    },
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
    }
};
