import axios from "axios";

const state = {
    current: [],
    queue: [],
    load_new_current: false,
};

const getters = {
    getCurrent: (state) => state.current,
    getQueue: (state) => state.queue,
    getLoadNewCurrent: (state) => state.load_new_current,
};

const actions = {
    async fetchCurrentApps({ commit }) {
        window.ipcRenderer.receive('response:aptstore:progress:current', (e, response) => {
            if (response) {
                commit('setCurrent', response);
                return;
            }
            const current = state.getCurrent();
            const loading = state.getLoadNewCurrent();
    
            if (current.length === 0 && !loading) {
                commit('setLoadNewCurrent', true);
            }
        });
        window.ipcRenderer.send('aptstore:progress:current')
    },
    async processNext({ commit }, nextApp) {
        window.ipcRenderer.receive('response:aptstore:process:next', (e, success) => {
            if (!success) {
                return;
            }
            commit('setLoadNewCurrent', false);
        });
        const loading = state.getLoadNewCurrent();
        if (!loading) {
            window.ipcRenderer.send('aptstore:process:next', nextApp);
        }
    },
    async addToQueue({ commit }, appAction) {
        // @todo: validate appAction before adding to queue
        let newQueue = state.getQueue();
        newQueue.push(appAction);
        commit('setQueue', newQueue);
    },
};

const mutations = {
    setCurrent: (state, currentApps) => (state.current = currentApps),
    setQueue: (state, queue) => (state.queue = queue),
    setLoadNewCurrent: (state, flag) => (state.load_new_current = flag),
};

export default {
    state,
    getters,
    actions,
    mutations,
}
