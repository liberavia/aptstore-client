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
    async startPolling(context) {
        console.log(`Enter startPolling() polling_started: ${state.polling_started}`);
        console.log(`Start TaskReceiver`);
        actions.startNextTaskReceiver(context);
        console.log(`Start ProgressReceiver`);
        actions.startCurrentProgressReceiver(context);
        const intervalId = setInterval(function() {
            console.log('Send signal for fetching current progress');
            window.ipcRenderer.send('aptstore:progress:current');
        }, POLL_INTERVAL_MS);
        console.log(`Start polling with intervalID: ${intervalId}`);

        context.commit('setIntervalId', intervalId);
        context.commit('setPollingStarted', true);
    },
    async stopPolling(context) {
        console.log(`Stop polling of intervalID: ${state.interval_id}`);
        actions.clearInterval(state.interval_id);
        context.commit('setIntervalId', 0);
        context.commit('setPollingStarted', false);
    },
    async addToQueue(context, appAction) {
        // @todo: validate appAction before adding to queue
        console.log(`Adding to queue: ${JSON.stringify(appAction)}`);
        let newQueue = state.queue;
        newQueue.push(appAction);
        console.log(`New queue after adding: ${JSON.stringify(newQueue)}`);
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
            console.log(`Get Response for channel 'response:aptstore:progress:current' with ${response} Stringified: ${JSON.stringify(response)}`);
            if (response) {
                context.commit('setCurrent', response);
                context.commit('setIsLoadingNewTask', false);
                return;
            }
            console.log(`There is no current progress. Check states: ${JSON.stringify(state)}`);
            // get current state
            const current = state.current_progress;
            const loading = state.is_loading_new_task;
    
            if (current.length === 0 && !loading) {
                // if no progress of aptstore-core and no loading of new task
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
      console.log(`Get next task from queue: ${JSON.stringify(queue)}`);
      if (queue.length === 0) {
          context.commit('setIsLoadingNewTask', false);
          console.log(`Nothing in queue. Early return`);
          return;
      }
      const nextTask = queue.shift();
      console.log(`Next task is: ${JSON.stringify(nextTask)}`);
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
