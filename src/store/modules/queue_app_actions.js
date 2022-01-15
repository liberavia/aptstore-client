import axios from "axios";

const POLL_INTERVAL_MS = 2000;

const state = {
    polling_started: false,
    interval_id: 0,
    current_progress: [],
    queue: [],
    is_loading_new_task: false,
};

const getters = {
    getPollingStarted: (state) => state.polling_started,
    getIntervalId: (state) => state.interval_id,
    getCurrentProgress: (state) => state.current_progress,
    getQueue: (state) => state.queue,
    getIsLoadingNewTask: (state) => state.is_loading_new_task,
};

const actions = {
    async startPolling({commit}) {
        const intervalId = setInterval(this.fetchCurrentProgress({commit}), POLL_INTERVAL_MS);
        commit('setIntervalId', intervalId);
        commit('setPollingStarted', true);
    },
    async stopPolling({commit}) {
        clearInterval(this.getIntervalId());
        commit('setIntervalId', 0);
        commit('setPollingStarted', false);
    },
    async addToQueue({ commit }, appAction) {
        // @todo: validate appAction before adding to queue
        let newQueue = state.getQueue();
        newQueue.push(appAction);
        commit('setQueue', newQueue);
    },
    async fetchCurrentProgress({ commit }) {
        window.ipcRenderer.receive('response:aptstore:progress:current', (e, response) => {
            if (response) {
                commit('setCurrent', response);
                commit('setIsLoadingNewTask', false);
                return;
            }
            
            // get current state
            const current = state.getCurrentProgress();
            const loading = state.getIsLoadingNewTask();
    
            if (current.length === 0 && !loading) {
                // if no progress of aptstore-core and no loading of new task
                const nextTask = this.getNextTaskFromQueue()
                if (nextTask) {
                    commit('setIsLoadingNewTask', true);
                    this.processNext(nextTask);
                }
            }
        });
        window.ipcRenderer.send('aptstore:progress:current')
    },
    async processNext({ commit }, nextTask) {
        window.ipcRenderer.receive('response:aptstore:process:next', (e, success) => {
            if (!success) {
                return;
            }
            commit('setIsLoadingNewTask', false);
        });
        const loading = state.getLoadNewCurrent();
        if (!loading) {
            window.ipcRenderer.send('aptstore:process:next', nextTask);
        }
    },
};

const mutations = {
    setPollingStarted: (state, flag) => (state.polling_started = flag),
    setIntervalId: (state, intervalId) => (state.interval_id = intervalId),
    setCurrentProgress: (state, currentProgress) => (state.current_progress = currentProgress),
    setQueue: (state, queue) => (state.queue = queue),
    setIsLoadingNewTask: (state, flag) => (state.is_loading_new_task = flag),
};

export default {
    state,
    getters,
    actions,
    mutations,
}
