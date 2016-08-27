import { coverageVariable, addHook, clearHooks } from './utils';

export default (options) => (input) => {
    return function istanbulInstrument(log) {
        const createInstrumenter = require('istanbul-lib-instrument').createInstrumenter;
        const hookRequire = require('istanbul-lib-hook').hookRequire;

        return new Promise((resolve, reject) => {
            const instrumenter = createInstrumenter({
                ...options,
                coverageVariable
            });

            clearHooks();

            const hook = hookRequire(
                // hook requires matches input files
                (file) => {
                    return input.indexOf(file) !== -1;
                },
                // and instrument that sources
                (source, file) => {
                    const result = instrumenter.instrumentSync(source, file);

                    log(file);

                    return result;
                }
            );

            addHook(hook);
            log('require() is hooked');

            resolve(input);
        });
    };
};
