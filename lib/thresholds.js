import { coverageVariable, clearHooks } from './utils';

export default (options = {}) => (input) => {
    return function istanbulThresholds(/* log */) {
        const libCoverage = require('istanbul-lib-coverage');

        return new Promise((resolve, reject) => {
            clearHooks();

            if (!global[coverageVariable]) {
                return reject('no coverage information was collected');
            }

            const coverageMap = libCoverage.createCoverageMap(global[coverageVariable]);
            const coverageSummary = libCoverage.createCoverageSummary();

            coverageMap.files().forEach((file) => {
                const fileCoverage = coverageMap.fileCoverageFor(file);
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
