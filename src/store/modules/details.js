import axios from "axios";

const state = {
    app: {},
};

const getters = {
    currentApp: (state) => state.app,
};

const actions = {
    async fetchApp({ commit }, id) {
        const baseurl = process.env.VUE_APP_APTSTORE_BASE_URL;
        const appurl = `${baseurl}api/app/${id}`;
        const response = await axios.get(appurl);
        commit('setApp', response.data)
    },
};

const mutations = {
    setApp: (state, app) => (state.app = app),
};

export default {
    state,
    getters,
    actions,
    mutations,
}
