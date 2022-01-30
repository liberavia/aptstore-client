const state = {
    settings: {
        general: {},
        platforms: {
            steam: {
                username: '',
                password: '',
            },
        },
        misc: {},
    },
    loaded: false,
    loaded_failed: false,
    saved: false,
    saved_failed: false,
};

const getters = {
    getSettings: (state) => state.settings,
    getLoaded: (state) => state.loaded,
    getSaved: (state) => state.saved,
    getLoadedFailed: (state) => state.loaded_failed,
    getSavedFailed: (state) => state.saved_failed,
};

const actions = {
    async loadSettings(context) {
        actions.startLoadedSettingsReceiver(context);
        window.ipcRenderer.send('aptstore:settings:load');
    },
    async saveSettings(context, settingsToSave) {
        actions.startSavedSettingsReceiver(context);
        window.ipcRenderer.send('aptstore:settings:save', settingsToSave);
        context.commit('setSettings', settingsToSave);
    },
    async resetLoadedState(context) {
        context.commit('setLoaded', false);
    },
    async resetLoadedFailedState(context) {
        context.commit('setLoadedFailed', false);
    },
    async resetSavedState(context) {
        context.commit('setSaved', false);
    },
    async resetSavedFailedState(context) {
        context.commit('setSavedFailed', false);
    },
    async startLoadedSettingsReceiver(context) {
        window.ipcRenderer.receive('response:aptstore:settings:load', (e, settings) => {
            if (!settings) {
                context.commit('setLoadedFailed', true);
                context.commit('setLoaded', false);
                return;
            }
            context.commit('setLoadedFailed', false);
            context.commit('setLoaded', true);
            context.commit('setSettings', settings);
        });
    },
    async startSavedSettingsReceiver(context) {
        window.ipcRenderer.receive('response:aptstore:settings:save', (e, saved) => {
            if (!saved) {
                context.commit('setSavedFailed', true);
                context.commit('setSaved', false);
                return;
            }
            context.commit('setSavedFailed', false);
            context.commit('setSaved', true);
        });
    },
};

const mutations = {
    setSettings: (state, settings) => (state.settings = settings),
    setLoaded: (state, flag) => (state.loaded = flag),
    setSaved: (state, flag) => (state.saved = flag),
    setLoadedFailed: (state, flag) => (state.loaded_failed = flag),
    setSavedFailed: (state, flag) => (state.saved_failed = flag),
};

export default {
    state,
    getters,
    actions,
    mutations,
}
