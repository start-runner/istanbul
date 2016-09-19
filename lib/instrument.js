import coverageVariable from './variable';
import hooks from './hooks';
import remapper from './remapper';

export default (options) => (input) => {
    return function istanbulInstrument(log) {
        const createInstrumenter = require('istanbul-lib-instrument').createInstrumenter;
        const hookRequire = require('istanbul-lib-hook').hookRequire;

        return new Promise((resolve, reject) => {
            const instrumenter = createInstrumenter({
                ...options,
                coverageVariable
            });

            hooks.clearAll();
            remapper.createStore();

            const hook = hookRequire(
                // hook requires matches input files
                (file) => {
                    return input.indexOf(file) !== -1;
                },
                // and instrument that sources
                (source, file) => {
                    const result = instrumenter.instrumentSync(source, file);

                    remapper.addSource(file, source);
                    log(file);

                    return result;
                }
            );

            hooks.add(hook);
            log('require() is hooked');

            resolve(input);
        });
    };
};
