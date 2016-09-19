import coverageVariable from './variable';
import hooks from './hooks';
import remapper from './remapper';

export default (options = {}) => (input) => {
    return function istanbulThresholds(/* log */) {
        const libCoverage = require('istanbul-lib-coverage');

        return new Promise((resolve, reject) => {
            hooks.clearAll();

            if (!global[coverageVariable]) {
                return reject('no coverage information was collected');
            }

            const coverageMap = libCoverage.createCoverageMap(global[coverageVariable]);
            const remappedCoverageMap = remapper.remapCoverageMap(coverageMap);
            const coverageSummary = libCoverage.createCoverageSummary();

            remappedCoverageMap.files().forEach((file) => {
                const fileCoverage = remappedCoverageMap.fileCoverageFor(file);
                const fileSummary = fileCoverage.toSummary();

                coverageSummary.merge(fileSummary);
            });

            const result = Object.keys(options).reduce((errors, key) => {
                const threshold = options[key];
                const summary = coverageSummary[key];

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
