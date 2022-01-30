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
    async startProgressPolling(context) {
        actions.startNextTaskReceiver(context);
        actions.startCurrentProgressReceiver(context);
        const intervalId = setInterval(function() {
            window.ipcRenderer.send('aptstore:progress:current');
        }, POLL_INTERVAL_MS);

        context.commit('setIntervalId', intervalId);
        context.commit('setPollingStarted', true);
    },
    async stopProgressPolling(context) {
        actions.clearInterval(state.interval_id);
        context.commit('setIntervalId', 0);
        context.commit('setPollingStarted', false);
    },
    async addToQueue(context, appAction) {
        // @todo: validate appAction before adding to queue
        let newQueue = state.queue;
        newQueue.push(appAction);
        context.commit('setQueue', newQueue);
    },
    async startNextTaskReceiver(context) {
        window.ipcRenderer.receive('response:aptstore:process:next', (e, success) => {
            if (!success) {
                return;
            }
            context.commit('setIsLoadingNewTask', false);
        });
    },
    async startCurrentProgressReceiver(context) {
        window.ipcRenderer.receive('response:aptstore:progress:current', (e, response) => {
            if (response) {
                context.commit('setCurrentProgress', response);
                context.commit('setIsLoadingNewTask', false);
                return;
            }
            context.commit('setCurrentProgress', {});
            const loading = state.is_loading_new_task;
    
            if (!loading) {
                const nextTask = actions.getNextTaskFromQueue(context)
                if (nextTask) {
                    actions.processNext(context, nextTask);
                }
            }
        });
    },
    async processNext(context, nextTask) {
        const loading = state.is_loading_new_task;
        if (!loading) {
            context.commit('setIsLoadingNewTask', true);
            window.ipcRenderer.send('aptstore:process:next', nextTask);
            return;
        }
    },
    getNextTaskFromQueue(context) {
      let queue = state.queue;
      if (queue.length === 0) {
          context.commit('setIsLoadingNewTask', false);
          return;
      }
      const nextTask = queue.shift();
      if (!nextTask) {
        context.commit('setIsLoadingNewTask', false);
        return;
      }
      context.commit('setQueue', queue);
      
      return nextTask;
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
