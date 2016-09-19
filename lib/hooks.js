class Hooks {
    constructor() {
        this.hooks = [];
    }

    add(hook) {
        this.hooks.push(hook);
    }

    clearAll() {
        this.hooks = this.hooks.filter((hook) => {
            hook();

            return false;
        });
    }
}

export default new Hooks();
