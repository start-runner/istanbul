import { createSourceMapStore } from 'istanbul-lib-source-maps';
import { fromSource as getSourceMapFromSource } from 'convert-source-map';

const isLargeSource = true;

class Remapper {
    constructor() {
        this.sourceMapStore = null;
    }

    createStore() {
        this.sourceMapStore = createSourceMapStore();
    }

    addSource(file, source) {
        const sourceMap = getSourceMapFromSource(source, isLargeSource);

        if (sourceMap) {
            this.sourceMapStore.registerMap(file, sourceMap.toObject());
        }
    }

    remapCoverageMap(coverageMap) {
        const transformedCoverage = this.sourceMapStore.transformCoverage(coverageMap);

        if (transformedCoverage) {
            return transformedCoverage.map;
        }
    }
}

export default new Remapper();
