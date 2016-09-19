import coverageVariable from './variable';
import hooks from './hooks';
import remapper from './remapper';

export default (formats = [ 'lcovonly', 'text-summary' ]) => (input) => {
    return function istanbulReport(log) {
        const createCoverageMap = require('istanbul-lib-coverage').createCoverageMap;
        const createReporter = require('istanbul-api').createReporter;

        return new Promise((resolve, reject) => {
            hooks.clearAll();

            if (!global[coverageVariable]) {
                return reject('no coverage information was collected');
            }

            const coverageMap = createCoverageMap(global[coverageVariable]);
            const remappedCoverageMap = remapper.remapCoverageMap(coverageMap);
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
