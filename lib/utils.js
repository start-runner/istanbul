let hooks = [];

export default {
    coverageVariable: '__start_istanbul__',
    addHook(hook) {
        hooks.push(hook);
    },
    clearHooks() {
        hooks.forEach((hook) => hook());

        hooks = [];
    }
};
