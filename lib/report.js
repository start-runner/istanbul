import { coverageVariable, clearHooks } from './utils';

export default (formats = [ 'lcovonly', 'text-summary' ]) => (input) => {
    return function istanbulReport(log) {
        const libCoverage = require('istanbul-lib-coverage');
        const createReporter = require('istanbul-api').createReporter;

        return new Promise((resolve, reject) => {
            clearHooks();

            if (!global[coverageVariable]) {
                return reject('no coverage information was collected');
            }

            const coverageMap = libCoverage.createCoverageMap(global[coverageVariable]);
            const reporter = createReporter();

            formats.forEach((format) => {
                log(format);

                reporter.add(format);
                reporter.write(coverageMap);
            });

            resolve(input);
        });
    };
};
