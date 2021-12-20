import axios from "axios";

const state = {
    teaser: [],
    featured: [],
};

const getters = {
    getTeaserApps: (state) => state.teaser,
    getFeaturedApps: (state) => state.featured
};

const actions = {
    async fetchTeaserApps({ commit }) {
        const baseurl = process.env.VUE_APP_APTSTORE_BASE_URL;
        const teaserurl = `${baseurl}api/teaser`;
        const response = await axios.get(teaserurl);
        commit('setTeaserApps', response.data)
    },
};

const mutations = {
    setTeaserApps: (state, teaser) => (state.teaser = teaser),
};

export default {
    state,
    getters,
    actions,
    mutations,
}
