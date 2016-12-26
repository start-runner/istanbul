import { fromSource as getSourceMapFromSource } from 'convert-source-map';
import coverageVariable from './variable';
import hooks from './hooks';

const isLargeSource = true;

export default (options) => (input) => {
  return function istanbulInstrument(log) {
    const createInstrumenter = require('istanbul-lib-instrument').createInstrumenter;
    const hookRequire = require('istanbul-lib-hook').hookRequire;

    return new Promise((resolve) => {
      const instrumenter = createInstrumenter({
        ...options,
        coverageVariable
      });

      hooks.clearAll();

      const hook = hookRequire(
        // hook requires matches input files
        (file) => {
          return input.indexOf(file) !== -1;
        },
        // and instrument that sources
        (source, file) => {
          let sourceMap = getSourceMapFromSource(source, isLargeSource);

          if (sourceMap) {
            sourceMap = sourceMap.toObject();
          }

          const result = instrumenter.instrumentSync(source, file, sourceMap);

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
