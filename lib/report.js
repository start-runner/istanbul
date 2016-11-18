import coverageVariable from './variable';
import hooks from './hooks';

export default (formats = [ 'lcovonly', 'text-summary' ]) => (input) => {
    return function istanbulReport(log) {
        const createCoverageMap = require('istanbul-lib-coverage').createCoverageMap;
        const createSourceMapStore = require('istanbul-lib-source-maps').createSourceMapStore;
        const createReporter = require('istanbul-api').createReporter;

        return new Promise((resolve, reject) => {
            hooks.clearAll();

            if (!global[coverageVariable]) {
                return reject('no coverage information was collected');
            }

            const coverageMap = createCoverageMap(global[coverageVariable]);
            const sourceMapStore = createSourceMapStore();
            const remappedCoverageMap = sourceMapStore.transformCoverage(coverageMap).map;
            const reporter = createReporter();

            formats.forEach((format) => {
                log(format);

                reporter.add(format);
                reporter.write(remappedCoverageMap);
            });

            resolve(input);
        });
    };
};
