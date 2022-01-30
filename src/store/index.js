import Vue from 'vue';
import Vuex from 'vuex';
import home from './modules/home.js';
import queue_app_actions from './modules/queue_app_actions.js';
import settings_state from './modules/settings.js';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    home,
    queue_app_actions,
    settings_state,
  }
})
